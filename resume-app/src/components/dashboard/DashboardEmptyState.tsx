"use client";

import React from "react";
import { Card, CardContent } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { FilePlus, ArrowRight, ShieldCheck } from "lucide-react";

export interface DashboardEmptyStateProps {
  onCreateFirstResume?: () => void;
}

export const DashboardEmptyState: React.FC<DashboardEmptyStateProps> = ({
  onCreateFirstResume,
}) => {
  return (
    <Card className="border-dashed border-2 border-slate-200/90 bg-white p-8 sm:p-12 text-center rounded-3xl shadow-xs">
      <CardContent className="max-w-md mx-auto flex flex-col items-center gap-4">
        <div className="w-14 h-14 rounded-2xl bg-indigo-50 text-[#4338CA] flex items-center justify-center border border-indigo-100 shadow-2xs">
          <FilePlus className="w-7 h-7" />
        </div>

        <div className="space-y-1.5">
          <h3 className="text-xl font-black tracking-tight text-slate-900">
            Your career workspace starts here.
          </h3>
          <p className="text-xs text-slate-500 leading-relaxed">
            Create an ATS-optimized resume in minutes, tailor it for specific job applications, and practice mock interviews with AI feedback.
          </p>
        </div>

        <Button
          variant="primary"
          size="lg"
          onClick={onCreateFirstResume}
          rightIcon={<ArrowRight className="w-4 h-4" />}
          className="font-bold shadow-md mt-2 bg-[#4338CA] hover:bg-[#3730A3] text-white rounded-xl"
        >
          Create Your First Resume
        </Button>

        <p className="text-[11px] text-slate-400 font-medium flex items-center gap-1 mt-1">
          <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" /> Takes under 3 minutes • ATS Ready
        </p>
      </CardContent>
    </Card>
  );
};

