"use client";

import React, { useState, useEffect, useRef } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import {
  Mic, MicOff, Video, VideoOff, Volume2, Play, Pause, RotateCcw,
  Clock, ArrowRight, SkipForward, LogOut, Loader2, Sparkles, CheckCircle2, ShieldCheck, AlertCircle, Eye
} from "lucide-react";
import { InterviewConfig } from "./InterviewSetup";

export interface ActiveInterviewScreenProps {
  config: InterviewConfig;
  questionIndex: number;
  totalQuestions: number;
  currentQuestionText: string;
  category?: string;
  hasCamera?: boolean;
  hasMic?: boolean;
  onSubmitAnswer: (answerText: string, durationSec: number, postureMetrics?: any) => Promise<void>;
  onSkipQuestion: () => void;
  onExitInterview: () => void;
}

export type SpeechStateMachineState =
  | "IDLE"
  | "REQUESTING_PERMISSION"
  | "MICROPHONE_READY"
  | "LISTENING"
  | "SPEECH_DETECTED"
  | "PROCESSING"
  | "TRANSCRIPT_READY"
  | "ERROR";

export const ActiveInterviewScreen: React.FC<ActiveInterviewScreenProps> = ({
  config,
  questionIndex,
  totalQuestions,
  currentQuestionText,
  category = "Technical",
  hasCamera = true,
  hasMic = true,
  onSubmitAnswer,
  onSkipQuestion,
  onExitInterview,
}) => {
  const [answerText, setAnswerText] = useState("");
  const [isRecording, setIsRecording] = useState(false);
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [timerSeconds, setTimerSeconds] = useState(0);

  // ── 1. Live Webcam & Posture Engine State ──
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [cameraActive, setCameraActive] = useState<boolean>(hasCamera);
  const [cameraPermissionGranted, setCameraPermissionGranted] = useState<boolean>(false);
  const [cameraError, setCameraError] = useState<string | null>(null);

  // Posture Frame-by-Frame Tracking Metrics over time
  const postureFrameStatsRef = useRef({
    totalFramesAnalyzed: 0,
    centeredFrames: 0,
    leftFrames: 0,
    rightFrames: 0,
    highFrames: 0,
    lowFrames: 0,
    tiltedFrames: 0,
    notDetectedFrames: 0,
  });

  const [postureHint, setPostureHint] = useState<string>("Analyzing camera alignment & posture...");
  const [postureStatus, setPostureStatus] = useState<"good" | "warning" | "error">("warning");
  const [faceDetected, setFaceDetected] = useState<boolean>(false);

  // Debug posture data for development mode
  const [debugPosture, setDebugPosture] = useState<{
    faceDetected: boolean;
    faceCenterX: number;
    faceCenterY: number;
    yaw: number;
    pitch: number;
    roll: number;
    faceSize: number;
    postureStatus: string;
  }>({
    faceDetected: false,
    faceCenterX: 0,
    faceCenterY: 0,
    yaw: 0,
    pitch: 0,
    roll: 0,
    faceSize: 0,
    postureStatus: "warning",
  });

  // ── 2. Speech-to-Text & Mic Engine State Machine ──
  const speechRecognitionRef = useRef<any | null>(null);
  const isRecordingRef = useRef<boolean>(false);
  const baseTextRef = useRef<string>("");
  const finalTranscriptRef = useRef<string>("");

  const [micPermissionGranted, setMicPermissionGranted] = useState<boolean>(false);
  const [speechSupported, setSpeechSupported] = useState<boolean>(true);
  const [speechState, setSpeechState] = useState<SpeechStateMachineState>("IDLE");
  const [speechStatusMessage, setSpeechStatusMessage] = useState<string>("Click 'Start Voice Input' to begin speaking");

  const [audioLevel, setAudioLevel] = useState<number>(0);
  const audioContextRef = useRef<AudioContext | null>(null);
  const audioStreamRef = useRef<MediaStream | null>(null);

  // Question timer
  useEffect(() => {
    setTimerSeconds(0);
    const interval = setInterval(() => {
      setTimerSeconds((prev) => prev + 1);
    }, 1000);
    return () => clearInterval(interval);
  }, [questionIndex]);

  // Reset speech state & posture stats when question changes to prevent stale data
  useEffect(() => {
    if (isRecordingRef.current && speechRecognitionRef.current) {
      try {
        speechRecognitionRef.current.stop();
      } catch {}
      isRecordingRef.current = false;
      setIsRecording(false);
    }
    finalTranscriptRef.current = "";
    baseTextRef.current = "";
    setAnswerText("");
    setSpeechState("IDLE");
    setSpeechStatusMessage("Click 'Start Voice Input' to begin speaking");
    postureFrameStatsRef.current = {
      totalFramesAnalyzed: 0,
      centeredFrames: 0,
      leftFrames: 0,
      rightFrames: 0,
      highFrames: 0,
      lowFrames: 0,
      tiltedFrames: 0,
      notDetectedFrames: 0,
    };
  }, [questionIndex]);

  // Check browser SpeechRecognition support on mount
  useEffect(() => {
    const SpeechRec =
      typeof window !== "undefined"
        ? (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition
        : null;

    if (!SpeechRec) {
      setSpeechSupported(false);
      setSpeechState("ERROR");
      setSpeechStatusMessage("Speech recognition is not supported in this browser.");
    }
  }, []);

  // ── 3. Live Webcam Stream Management ──
  useEffect(() => {
    let isSubscribed = true;

    const startWebcam = async () => {
      setCameraError(null);
      if (!cameraActive) {
        if (streamRef.current) {
          streamRef.current.getTracks().forEach((t) => t.stop());
          streamRef.current = null;
        }
        setCameraPermissionGranted(false);
        setFaceDetected(false);
        setPostureStatus("error");
        setPostureHint("Camera disabled • Posture data unavailable");
        return;
      }

      try {
        if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
          throw new Error("Webcam API is not supported in this browser.");
        }

        const stream = await navigator.mediaDevices.getUserMedia({
          video: {
            width: { ideal: 640 },
            height: { ideal: 480 },
            frameRate: { ideal: 30 },
          },
          audio: false,
        });

        if (!isSubscribed) {
          stream.getTracks().forEach((t) => t.stop());
          return;
        }

        streamRef.current = stream;
        setCameraPermissionGranted(true);

        if (videoRef.current) {
          videoRef.current.srcObject = stream;
          videoRef.current.onloadedmetadata = () => {
            videoRef.current?.play().catch(() => {});
          };
        }
      } catch (err: any) {
        console.warn("Webcam error:", err.message);
        if (isSubscribed) {
          setCameraActive(false);
          setCameraPermissionGranted(false);
          setCameraError("Camera permission denied or unavailable.");
          setPostureStatus("error");
          setPostureHint("Camera unavailable • Posture data unavailable");
        }
      }
    };

    startWebcam();

    return () => {
      isSubscribed = false;
      if (streamRef.current) {
        streamRef.current.getTracks().forEach((t) => t.stop());
        streamRef.current = null;
      }
    };
  }, [cameraActive]);

  // ── 4. Computer Vision Posture Analysis Engine (Real Frame Tracking) ──
  useEffect(() => {
    if (!cameraActive || !cameraPermissionGranted) return;

    const canvas = document.createElement("canvas");
    canvasRef.current = canvas;
    const ctx = canvas.getContext("2d", { willReadFrequently: true });

    let prevPixels: Uint8ClampedArray | null = null;

    const analyzeFrame = () => {
      const video = videoRef.current;
      if (!video || !ctx || video.readyState < 2 || !video.videoWidth) return;

      canvas.width = 160;
      canvas.height = 120;
      ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

      const frame = ctx.getImageData(0, 0, canvas.width, canvas.height);
      const data = frame.data;

      let skinCount = 0;
      let sumX = 0;
      let sumY = 0;
      let leftCount = 0;
      let rightCount = 0;
      let topCount = 0;
      let bottomCount = 0;
      let diffSum = 0;

      const totalPixels = data.length / 4;
      const halfWidth = canvas.width / 2;
      const halfHeight = canvas.height / 2;

      for (let i = 0; i < data.length; i += 4) {
        const r = data[i];
        const g = data[i + 1];
        const b = data[i + 2];

        // Skin-tone & facial contrast detection algorithm
        const isSkin =
          r > 45 && g > 25 && b > 15 &&
          r > g && r > b &&
          (Math.max(r, g, b) - Math.min(r, g, b)) > 15 &&
          Math.abs(r - g) > 15;

        const pIndex = i / 4;
        const x = pIndex % canvas.width;
        const y = Math.floor(pIndex / canvas.width);

        if (isSkin) {
          skinCount++;
          sumX += x;
          sumY += y;

          if (x < halfWidth) leftCount++;
          else rightCount++;

          if (y < halfHeight) topCount++;
          else bottomCount++;
        }

        if (prevPixels) {
          const lum = 0.299 * r + 0.587 * g + 0.114 * b;
          const prevLum = 0.299 * prevPixels[i] + 0.587 * prevPixels[i + 1] + 0.114 * prevPixels[i + 2];
          diffSum += Math.abs(lum - prevLum);
        }
      }

      prevPixels = data;

      const faceDetectedVal = skinCount > totalPixels * 0.035;
      const faceSizeVal = skinCount / totalPixels;
      const faceCenterXVal = faceDetectedVal ? sumX / skinCount / canvas.width : 0.5;
      const faceCenterYVal = faceDetectedVal ? sumY / skinCount / canvas.height : 0.5;

      const yawEstimate = faceDetectedVal ? ((leftCount - rightCount) / (skinCount || 1)) * 60 : 0;
      const pitchEstimate = faceDetectedVal ? ((topCount - bottomCount) / (skinCount || 1)) * 60 : 0;
      const rollEstimate = faceDetectedVal ? (Math.abs(leftCount - rightCount) / (skinCount || 1)) * 40 : 0;

      setFaceDetected(faceDetectedVal);

      // Record frame statistics for true calculated posture score
      const stats = postureFrameStatsRef.current;
      stats.totalFramesAnalyzed++;

      let statusVal: "good" | "warning" | "error" = "good";
      let hintVal = "Face remained centered";

      if (!faceDetectedVal) {
        statusVal = "error";
        hintVal = "Face not detected — please position yourself in front of the camera.";
        stats.notDetectedFrames++;
      } else if (faceCenterYVal < 0.25) {
        statusVal = "warning";
        hintVal = "Face too high — adjust camera angle";
        stats.highFrames++;
      } else if (faceCenterYVal > 0.70) {
        statusVal = "warning";
        hintVal = "Face too low — sit up straight";
        stats.lowFrames++;
      } else if (faceCenterXVal > 0.65) {
        statusVal = "warning";
        hintVal = "Face too far left — center yourself";
        stats.leftFrames++;
      } else if (faceCenterXVal < 0.35) {
        statusVal = "warning";
        hintVal = "Face too far right — center yourself";
        stats.rightFrames++;
      } else if (Math.abs(rollEstimate) > 22) {
        statusVal = "warning";
        hintVal = "Face tilted — sit upright";
        stats.tiltedFrames++;
      } else if (Math.abs(yawEstimate) > 25 || Math.abs(pitchEstimate) > 25) {
        statusVal = "warning";
        hintVal = "Looking away — look toward camera";
        stats.leftFrames++;
      } else {
        stats.centeredFrames++;
      }

      setPostureStatus(statusVal);
      setPostureHint(hintVal);

      setDebugPosture({
        faceDetected: faceDetectedVal,
        faceCenterX: Number(faceCenterXVal.toFixed(2)),
        faceCenterY: Number(faceCenterYVal.toFixed(2)),
        yaw: Number(yawEstimate.toFixed(1)),
        pitch: Number(pitchEstimate.toFixed(1)),
        roll: Number(rollEstimate.toFixed(1)),
        faceSize: Number(faceSizeVal.toFixed(3)),
        postureStatus: statusVal,
      });
    };

    const interval = setInterval(analyzeFrame, 1000);
    return () => clearInterval(interval);
  }, [cameraActive, cameraPermissionGranted]);

  // ── 5. AI Text-to-Speech Playback ──
  const handlePlayTTS = () => {
    if (!window.speechSynthesis) {
      alert("Speech synthesis is not supported in this browser.");
      return;
    }

    if (isPlayingAudio) {
      window.speechSynthesis.cancel();
      setIsPlayingAudio(false);
      return;
    }

    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(currentQuestionText);
    utterance.rate = 0.95;
    utterance.pitch = 1.0;
    utterance.lang = "en-US";

    const voices = window.speechSynthesis.getVoices();
    const englishVoice = voices.find((v) => v.lang.startsWith("en") && (v.name.includes("Google") || v.name.includes("Natural")));
    if (englishVoice) {
      utterance.voice = englishVoice;
    }

    utterance.onend = () => setIsPlayingAudio(false);
    utterance.onerror = () => setIsPlayingAudio(false);

    setIsPlayingAudio(true);
    window.speechSynthesis.speak(utterance);
  };

  // ── 6. Speech-to-Text Voice Engine State Machine ──
  const toggleRecording = async () => {
    if (isRecordingRef.current) {
      stopSpeechRecognition();
      return;
    }

    const SpeechRec =
      typeof window !== "undefined"
        ? (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition
        : null;

    if (!SpeechRec) {
      setSpeechState("ERROR");
      setSpeechStatusMessage("Speech recognition is not supported in this browser.");
      return;
    }

    setSpeechState("REQUESTING_PERMISSION");
    setSpeechStatusMessage("Requesting microphone access...");

    // Request Mic permission first
    try {
      if (!audioStreamRef.current) {
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
        audioStreamRef.current = stream;
      }
      setMicPermissionGranted(true);
      setSpeechState("MICROPHONE_READY");
    } catch (err: any) {
      console.warn("Microphone access denied:", err.message);
      setMicPermissionGranted(false);
      setSpeechState("ERROR");
      setSpeechStatusMessage("Microphone permission denied.");
      return;
    }

    try {
      baseTextRef.current = answerText;
      finalTranscriptRef.current = "";

      const recognition = new SpeechRec();
      speechRecognitionRef.current = recognition;

      recognition.continuous = true;
      recognition.interimResults = true;
      recognition.lang = "en-US";

      recognition.onstart = () => {
        setSpeechState("LISTENING");
        setSpeechStatusMessage("Listening... Speak your response into your microphone");
      };

      recognition.onresult = (event: any) => {
        setSpeechState("SPEECH_DETECTED");

        let currentInterim = "";
        let currentFinal = "";

        for (let i = event.resultIndex; i < event.results.length; i++) {
          const chunk = event.results[i][0].transcript;
          if (event.results[i].isFinal) {
            currentFinal += chunk + " ";
          } else {
            currentInterim += chunk;
          }
        }

        if (currentFinal) {
          finalTranscriptRef.current += currentFinal;
        }

        const combinedText =
          (baseTextRef.current ? baseTextRef.current.trim() + " " : "") +
          finalTranscriptRef.current +
          currentInterim;

        setAnswerText(combinedText.trim());
      };

      recognition.onerror = (event: any) => {
        let userMsg = "Speech recognition error occurred.";
        switch (event.error) {
          case "not-allowed":
            userMsg = "Microphone permission denied.";
            break;
          case "service-not-allowed":
            userMsg = "Speech recognition service unavailable.";
            break;
          case "no-speech":
            userMsg = "No speech detected.";
            break;
          case "audio-capture":
            userMsg = "Microphone not detected.";
            break;
          case "network":
            userMsg = "Network error during speech recognition.";
            break;
        }

        if (event.error !== "no-speech") {
          setSpeechState("ERROR");
          setSpeechStatusMessage(userMsg);
          stopSpeechRecognition();
        }
      };

      recognition.onend = () => {
        if (isRecordingRef.current && speechRecognitionRef.current) {
          try {
            recognition.start();
          } catch {
            stopSpeechRecognition();
          }
        } else {
          stopSpeechRecognition();
        }
      };

      isRecordingRef.current = true;
      setIsRecording(true);
      recognition.start();
      startAudioMeter();
    } catch (err: any) {
      stopSpeechRecognition();
    }
  };

  const stopSpeechRecognition = () => {
    isRecordingRef.current = false;
    setIsRecording(false);
    if (speechRecognitionRef.current) {
      try {
        speechRecognitionRef.current.stop();
      } catch {}
      speechRecognitionRef.current = null;
    }
    stopAudioMeter();
    if (speechState === "LISTENING" || speechState === "SPEECH_DETECTED") {
      setSpeechState("TRANSCRIPT_READY");
      setSpeechStatusMessage("Voice recording complete.");
    }
  };

  const startAudioMeter = () => {
    try {
      if (!audioStreamRef.current) return;
      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
      if (!AudioCtx) return;

      const audioCtx = new AudioCtx();
      audioContextRef.current = audioCtx;
      const source = audioCtx.createMediaStreamSource(audioStreamRef.current);
      const analyser = audioCtx.createAnalyser();
      analyser.fftSize = 64;
      source.connect(analyser);

      const dataArray = new Uint8Array(analyser.frequencyBinCount);

      const updateMeter = () => {
        if (!audioContextRef.current || audioContextRef.current.state === "closed" || !isRecordingRef.current) return;
        analyser.getByteFrequencyData(dataArray);
        let sum = 0;
        for (let i = 0; i < dataArray.length; i++) {
          sum += dataArray[i];
        }
        const avg = sum / dataArray.length;
        setAudioLevel(Math.min(100, Math.round((avg / 128) * 100)));
        requestAnimationFrame(updateMeter);
      };

      updateMeter();
    } catch {}
  };

  const stopAudioMeter = () => {
    if (audioContextRef.current && audioContextRef.current.state !== "closed") {
      audioContextRef.current.close().catch(() => {});
      audioContextRef.current = null;
    }
    setAudioLevel(0);
  };

  // Clean up on component unmount
  useEffect(() => {
    return () => {
      if (speechRecognitionRef.current) {
        try {
          speechRecognitionRef.current.abort();
        } catch {}
      }
      if (audioStreamRef.current) {
        audioStreamRef.current.getTracks().forEach((t) => t.stop());
      }
      if (audioContextRef.current) {
        audioContextRef.current.close().catch(() => {});
      }
    };
  }, []);

  const getPostureMetricsForSubmission = () => {
    const stats = postureFrameStatsRef.current;
    if (!cameraActive || !cameraPermissionGranted || stats.totalFramesAnalyzed === 0) {
      return {
        totalFrames: 0,
        centeredFrames: 0,
        centeredPercentage: null,
      };
    }
    const centeredPercentage = Math.round((stats.centeredFrames / stats.totalFramesAnalyzed) * 100);
    return {
      totalFrames: stats.totalFramesAnalyzed,
      centeredFrames: stats.centeredFrames,
      centeredPercentage,
    };
  };

  const handleFinishAnswerSubmit = async () => {
    if (window.speechSynthesis) {
      window.speechSynthesis.cancel();
      setIsPlayingAudio(false);
    }

    stopSpeechRecognition();
    setSpeechState("PROCESSING");
    setIsAnalyzing(true);

    const postureMetrics = getPostureMetricsForSubmission();

    try {
      await onSubmitAnswer(answerText, timerSeconds, postureMetrics);
    } finally {
      setIsAnalyzing(false);
    }
  };

  const formatTimer = (sec: number) => {
    const mins = Math.floor(sec / 60);
    const remainderSec = sec % 60;
    return `${mins}:${remainderSec < 10 ? "0" : ""}${remainderSec}`;
  };

  const progressPercent = Math.round(((questionIndex + 1) / totalQuestions) * 100);

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      {/* Header & Progress Bar */}
      <div className="bg-white border border-[#E4E4E7] rounded-xl p-4 shadow-xs space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="text-sm font-black text-[#09090B] tracking-tight">
              Resume<span className="text-[#4F46E5]">AI</span>
            </span>
            <span className="text-[#D4D4D8]">•</span>
            <Badge variant="indigo" size="sm">
              Question {questionIndex + 1} of {totalQuestions}
            </Badge>
            <Badge variant="neutral" size="sm" className="hidden sm:inline-flex">
              {category}
            </Badge>
          </div>

          <div className="flex items-center gap-4 text-xs font-semibold text-[#52525B]">
            <span className="flex items-center gap-1.5 font-mono text-[#09090B] bg-[#FAF9F6] px-3 py-1.5 rounded-lg border border-[#E4E4E7]">
              <Clock className="w-3.5 h-3.5 text-[#4F46E5]" /> {formatTimer(timerSeconds)}
            </span>

            <button
              onClick={onExitInterview}
              className="flex items-center gap-1 text-[#71717A] hover:text-[#EF4444] transition-colors"
            >
              <LogOut className="w-3.5 h-3.5" /> Exit
            </button>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="w-full h-2 bg-[#F4F4F5] rounded-full overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-[#4F46E5] to-[#10B981] transition-all duration-300"
            style={{ width: `${progressPercent}%` }}
          />
        </div>
      </div>

      {/* Analyzing Transition Overlay */}
      {isAnalyzing && (
        <Card className="border-[#E4E4E7] bg-white p-12 text-center flex flex-col items-center justify-center space-y-4 shadow-sm">
          <Loader2 className="w-10 h-10 text-[#4F46E5] animate-spin" />
          <h3 className="text-lg font-bold text-[#09090B]">Analyzing your response...</h3>
          <p className="text-xs text-[#71717A]">Calculating technical relevance, STAR structure, and speaking metrics.</p>
        </Card>
      )}

      {!isAnalyzing && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Question & Answer Panel */}
          <div className="lg:col-span-2 space-y-6">
            {/* AI Question Card */}
            <Card className="border-[#E4E4E7] bg-white shadow-xs">
              <CardHeader className="pb-3 border-b border-[#F4F4F5] flex items-center justify-between">
                <span className="text-xs font-bold uppercase tracking-wider text-[#4F46E5] flex items-center gap-1.5">
                  <Sparkles className="w-4 h-4" /> AI Interviewer Question
                </span>

                <Button
                  variant="outline"
                  size="sm"
                  onClick={handlePlayTTS}
                  leftIcon={isPlayingAudio ? <Pause className="w-3.5 h-3.5 text-[#4F46E5]" /> : <Volume2 className="w-3.5 h-3.5 text-[#4F46E5]" />}
                  className="text-xs"
                >
                  {isPlayingAudio ? "Pause Voice" : "Play Question Voice"}
                </Button>
              </CardHeader>
              <CardContent className="pt-5 space-y-4">
                <p className="text-base sm:text-lg font-extrabold text-[#09090B] leading-relaxed">
                  &ldquo;{currentQuestionText}&rdquo;
                </p>
              </CardContent>
            </Card>

            {/* Answer Input Panel */}
            <Card className="border-[#E4E4E7] bg-white shadow-xs space-y-4 p-5">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-semibold uppercase tracking-wider text-[#52525B]">
                    Your Answer Response
                  </span>
                  <Badge variant={micPermissionGranted ? "success" : "neutral"} size="sm">
                    {micPermissionGranted ? "✓ Mic Granted" : "Mic Off"}
                  </Badge>
                </div>

                <div className="flex items-center gap-2">
                  <Button
                    variant={isRecording ? "secondary" : "outline"}
                    size="sm"
                    onClick={toggleRecording}
                    disabled={!speechSupported}
                    leftIcon={isRecording ? <MicOff className="w-3.5 h-3.5 text-[#EF4444] animate-pulse" /> : <Mic className="w-3.5 h-3.5 text-[#10B981]" />}
                    className={isRecording ? "border-[#FCA5A5] bg-[#FEF2F2] text-[#991B1B]" : ""}
                  >
                    {isRecording ? "Stop Voice Input" : "Start Voice Input"}
                  </Button>
                </div>
              </div>

              {/* Speech Recognition Status Banner */}
              <div className={`p-3 rounded-lg border text-2xs transition-all flex items-center justify-between ${
                speechState === "LISTENING" || speechState === "SPEECH_DETECTED"
                  ? "bg-[#EEF2FF] border-[#C7D2FE] text-[#3730A3]"
                  : speechState === "ERROR" || !speechSupported
                  ? "bg-[#FEF2F2] border-[#FCA5A5] text-[#991B1B]"
                  : "bg-[#FAF9F6] border-[#E4E4E7] text-[#52525B]"
              }`}>
                <div className="flex items-center gap-2">
                  {speechState === "LISTENING" || speechState === "SPEECH_DETECTED" ? (
                    <Mic className="w-3.5 h-3.5 text-[#4F46E5] animate-pulse flex-shrink-0" />
                  ) : (
                    <AlertCircle className="w-3.5 h-3.5 text-[#71717A] flex-shrink-0" />
                  )}
                  <span>{speechStatusMessage}</span>
                </div>

                {(!speechSupported || speechState === "ERROR") && (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      const el = document.querySelector("textarea");
                      if (el) (el as HTMLTextAreaElement).focus();
                    }}
                    className="text-xs shrink-0 font-semibold"
                  >
                    Type Answer Instead
                  </Button>
                )}

                {isRecording && (
                  <div className="flex items-center gap-2 font-mono text-2xs font-bold text-[#4F46E5]">
                    <div className="w-16 h-2 bg-white rounded-full overflow-hidden border border-[#C7D2FE]">
                      <div
                        className="h-full bg-[#4F46E5] transition-all duration-75"
                        style={{ width: `${Math.max(10, audioLevel)}%` }}
                      />
                    </div>
                    <span>{audioLevel}%</span>
                  </div>
                )}
              </div>

              <textarea
                rows={5}
                value={answerText}
                onChange={(e) => setAnswerText(e.target.value)}
                placeholder="Speak using your microphone or type your detailed response here..."
                className="w-full p-3.5 rounded-xl border border-[#E4E4E7] bg-[#FAF9F6] text-sm text-[#09090B] placeholder-[#A1A1AA] focus:outline-none focus:ring-2 focus:ring-[#4F46E5]/30 focus:border-[#4F46E5] leading-relaxed"
              />

              <div className="flex items-center justify-between text-xs text-[#71717A] pt-1">
                <span>Words: {answerText.trim() ? answerText.trim().split(/\s+/).length : 0}</span>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm" onClick={onSkipQuestion} leftIcon={<SkipForward className="w-3.5 h-3.5" />}>
                    Skip Question
                  </Button>
                  <Button
                    variant="primary"
                    size="sm"
                    onClick={handleFinishAnswerSubmit}
                    rightIcon={<ArrowRight className="w-4 h-4" />}
                    className="font-bold px-5"
                  >
                    Submit & Next Question
                  </Button>
                </div>
              </div>
            </Card>
          </div>

          {/* Side Panel: Webcam & Real-Time Posture Computer Vision Coaching */}
          <div className="space-y-4">
            <Card className="border-[#E4E4E7] bg-white p-4 shadow-xs space-y-3">
              <div className="flex items-center justify-between text-xs font-bold text-[#09090B]">
                <div className="flex items-center gap-2">
                  <span className="flex items-center gap-1.5">
                    <Video className="w-4 h-4 text-[#4F46E5]" /> Live Webcam
                  </span>
                  <Badge variant={cameraPermissionGranted ? "success" : "neutral"} size="sm">
                    {cameraPermissionGranted ? "✓ Camera Granted" : "Camera Off"}
                  </Badge>
                </div>

                <button
                  onClick={() => setCameraActive(!cameraActive)}
                  className="text-2xs text-[#71717A] hover:text-[#09090B] font-semibold"
                >
                  {cameraActive ? "Disable Camera" : "Enable Camera"}
                </button>
              </div>

              {/* Webcam Video Container */}
              <div className="relative aspect-video rounded-xl bg-[#09090B] overflow-hidden flex items-center justify-center border border-[#E4E4E7]">
                <video
                  ref={videoRef}
                  autoPlay
                  playsInline
                  muted
                  className={`w-full h-full object-cover transform -scale-x-100 ${
                    cameraActive ? "block" : "hidden"
                  }`}
                />

                {!cameraActive && (
                  <div className="text-center p-4 text-[#A1A1AA] space-y-1">
                    <VideoOff className="w-8 h-8 mx-auto text-[#71717A]" />
                    <p className="text-xs font-semibold text-white">Camera Disabled</p>
                  </div>
                )}
              </div>

              {cameraError && (
                <div className="flex items-center gap-1.5 p-2 rounded bg-[#FEF2F2] text-2xs text-[#991B1B]">
                  <AlertCircle className="w-3.5 h-3.5 text-[#EF4444] flex-shrink-0" />
                  <span>{cameraError}</span>
                </div>
              )}

              {/* Real-time Canvas Computer Vision Posture Coaching Banner */}
              <div className={`p-3 rounded-lg border text-2xs transition-all space-y-1.5 ${
                postureStatus === "good"
                  ? "bg-[#F0FDF4] border-[#BBF7D0] text-[#166534]"
                  : postureStatus === "warning"
                  ? "bg-[#FFFBEB] border-[#FDE68A] text-[#92400E]"
                  : "bg-[#FEF2F2] border-[#FCA5A5] text-[#991B1B]"
              }`}>
                <div className="font-bold flex items-center justify-between">
                  <span className="flex items-center gap-1.5">
                    <ShieldCheck className={`w-3.5 h-3.5 ${
                      postureStatus === "good" ? "text-[#10B981]" : postureStatus === "warning" ? "text-[#F59E0B]" : "text-[#EF4444]"
                    }`} />
                    Posture & Positioning Coaching
                  </span>
                  <Badge variant={faceDetected ? "success" : "error"} size="sm">
                    {faceDetected ? "✓ Face Detected" : "⚠ No Face"}
                  </Badge>
                </div>
                <p className="leading-relaxed font-medium">{postureHint}</p>
              </div>

              {/* Development Mode Posture Engine Debug Overlay */}
              {process.env.NODE_ENV === "development" && (
                <div className="p-2.5 rounded-lg bg-[#FAF9F6] border border-[#E4E4E7] text-2xs font-mono space-y-1 text-[#52525B]">
                  <div className="font-bold text-[#09090B] flex items-center gap-1">
                    <Eye className="w-3 h-3 text-[#4F46E5]" /> Posture Engine Debug Log:
                  </div>
                  <div className="grid grid-cols-2 gap-x-2 gap-y-0.5">
                    <span>Detected: {debugPosture.faceDetected ? "true" : "false"}</span>
                    <span>Status: {debugPosture.postureStatus}</span>
                    <span>CenterX: {debugPosture.faceCenterX}</span>
                    <span>CenterY: {debugPosture.faceCenterY}</span>
                    <span>Yaw: {debugPosture.yaw}°</span>
                    <span>Pitch: {debugPosture.pitch}°</span>
                    <span>Roll: {debugPosture.roll}°</span>
                    <span>Size: {debugPosture.faceSize}</span>
                  </div>
                </div>
              )}
            </Card>

            {/* Practice Tip Card */}
            <Card className="border-[#E4E4E7] bg-white p-4 shadow-xs space-y-2 text-xs text-[#52525B]">
              <div className="font-bold text-[#09090B] uppercase tracking-wider text-2xs text-[#4F46E5]">
                Practice Tip
              </div>
              <p className="leading-relaxed">
                Use the <strong>STAR Method</strong>: Describe the <strong>Situation</strong>, your <strong>Task</strong>, specific <strong>Actions</strong>, and quantifiable <strong>Results</strong>.
              </p>
            </Card>
          </div>
        </div>
      )}
    </div>
  );
};
