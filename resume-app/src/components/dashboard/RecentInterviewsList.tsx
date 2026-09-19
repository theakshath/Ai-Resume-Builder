"use client";

import React from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Mic, ArrowRight, Calendar, Award } from "lucide-react";

export interface InterviewSession {
  id: string;
  role: string;
  type: string;
  score: number;
  date: string;
  questionsCount: number;
}

export const mockInterviews: InterviewSession[] = [
  {
    id: "int-1",
    role: "Senior Product Designer at Stripe",
    type: "Behavioral & Leadership (STAR)",
    score: 90,
    date: "Yesterday, 4:30 PM",
    questionsCount: 5,
  },
  {
    id: "int-2",
    role: "Staff UI Architect at Figma",
    type: "Design Systems & Technical Deep Dive",
    score: 84,
    date: "3 days ago",
    questionsCount: 4,
  },
];

export interface RecentInterviewsListProps {
  interviews?: InterviewSession[];
  onStartNew?: () => void;
  onViewFeedback?: (id: string) => void;
}

export const RecentInterviewsList: React.FC<RecentInterviewsListProps> = ({
  interviews = [],
  onStartNew,
  onViewFeedback,
}) => {
  return (
    <Card className="border-[#E4E4E7] bg-white">
      <CardHeader className="pb-3 border-b border-[#F4F4F5]">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Mic className="w-5 h-5 text-[#4F46E5]" />
            <div>
              <CardTitle className="text-base font-semibold">AI Mock Interview Sessions</CardTitle>
              <p className="text-xs text-[#71717A]">Practice sessions & feedback reports</p>
            </div>
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={onStartNew}
            leftIcon={<Mic className="w-3.5 h-3.5 text-[#4F46E5]" />}
          >
            Start Practice
          </Button>
        </div>
      </CardHeader>
      <CardContent className="pt-4 space-y-3">
        {interviews.length === 0 ? (
          <div className="p-8 text-center text-xs text-[#71717A] space-y-2">
            <p className="font-semibold text-[#09090B]">No interview sessions completed yet.</p>
            <p>Click &quot;Start Practice&quot; to begin your personalized AI Mock Interview.</p>
          </div>
        ) : (
          interviews.map((session) => (
            <div
              key={session.id}
              className="p-3.5 bg-[#FAF9F6] border border-[#E4E4E7] rounded-xl flex flex-col sm:flex-row sm:items-center justify-between gap-3 hover:border-[#D4D4D8] transition-colors"
            >
              <div className="flex items-start gap-3">
                <div className="p-2.5 rounded-lg bg-white border border-[#E4E4E7] text-[#4F46E5] shrink-0 mt-0.5">
                  <Award className="w-4 h-4" />
                </div>
                <div className="space-y-0.5 text-left">
                  <h4 className="text-xs font-bold text-[#09090B]">{session.role}</h4>
                  <p className="text-[11px] text-[#52525B]">
                    {session.type} • {session.questionsCount} Questions Evaluated
                  </p>
                  <div className="flex items-center gap-2 text-[10px] text-[#A1A1AA] pt-0.5">
                    <span className="flex items-center gap-1">
                      <Calendar className="w-3 h-3" /> {session.date}
                    </span>
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-between sm:justify-end gap-3 pt-2 sm:pt-0 border-t sm:border-t-0 border-[#E4E4E7]">
                <Badge variant={session.score >= 75 ? "indigo" : session.score >= 40 ? "warning" : "error"} size="md" className="font-bold">
                  {typeof session.score === 'number' ? `${session.score}/100 Score` : "Not enough data"}
                </Badge>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => onViewFeedback?.(session.id)}
                  rightIcon={<ArrowRight className="w-3.5 h-3.5" />}
                  className="text-xs font-medium text-[#4F46E5] hover:bg-white"
                >
                  View Feedback
                </Button>
              </div>
            </div>
          ))
        )}
      </CardContent>
    </Card>
  );
};
