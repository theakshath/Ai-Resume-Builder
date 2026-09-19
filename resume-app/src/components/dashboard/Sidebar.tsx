"use client";

import React from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useAuth } from "@/lib/firebase/context";
import { cn } from "@/lib/utils";
import {
  Sparkles,
  LayoutDashboard,
  FileText,
  Bot,
  Target,
  Mic,
  LayoutTemplate,
  Settings,
  HelpCircle,
  LogOut,
  Crown,
  BookOpen,
  ArrowRight,
} from "lucide-react";

/** Derive initials from name or email */
function getInitials(name: string): string {
  if (!name) return "?";
  const parts = name.trim().split(/\s+/);
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
}

export interface SidebarProps {
  className?: string;
  onCloseMobile?: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ className, onCloseMobile }) => {
  const pathname = usePathname();
  const router = useRouter();
  const { user, profile, loading } = useAuth();

  // Derive display name: Firestore profile > Firebase displayName > email prefix
  const displayName = !loading
    ? (profile?.fullName ||
       user?.displayName ||
       (user?.email ? user.email.split("@")[0] : ""))
    : "";
  const userEmail = user?.email || "";
  const initials = getInitials(displayName);


  const navItems = [
    { label: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
    { label: "My Resume", href: "/dashboard/resumes", icon: FileText },
    { label: "Templates", href: "/dashboard/templates", icon: LayoutTemplate },
    { label: "AI Optimizer", href: "/dashboard/assistant", icon: Bot },
    { label: "Job Match", href: "/dashboard/ats", icon: Target },
    { label: "Interview Practice", href: "/dashboard/interviews", icon: Mic },
    { label: "Career Resources", href: "/dashboard/resources", icon: BookOpen },
  ];

  return (
    <aside
      className={cn(
        "w-60 bg-[#FAF9FD]/80 border-r border-slate-200/80 flex flex-col justify-between h-[calc(100vh-4rem)] sticky top-16 z-30 select-none py-3 px-3",
        className
      )}
    >
      {/* Main Menu Navigation Links */}
      <div className="space-y-4 flex-1 overflow-y-auto pr-1">
        <nav className="space-y-1.5">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive =
              pathname === item.href ||
              (item.href === "/dashboard" && pathname === "/dashboard");
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={onCloseMobile}
                className={cn(
                  "flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs transition-all group",
                  isActive
                    ? "bg-[#6366F1] text-white font-bold shadow-md shadow-indigo-500/20"
                    : "text-slate-600 hover:text-slate-900 hover:bg-slate-100/80 font-semibold"
                )}
              >
                <div className="flex items-center gap-3">
                  <Icon
                    className={cn(
                      "w-4 h-4 transition-colors",
                      isActive
                        ? "text-white"
                        : "text-slate-400 group-hover:text-slate-700"
                    )}
                  />
                  <span>{item.label}</span>
                </div>
              </Link>
            );
          })}
        </nav>

        {/* Upgrade to Pro Promotion Banner Card */}
        <div className="p-3.5 rounded-2xl bg-gradient-to-br from-indigo-50/90 via-purple-50/60 to-blue-50/50 border border-indigo-100/90 shadow-2xs space-y-2 mt-4 text-left">
          <div className="flex items-center gap-1.5 text-xs font-extrabold text-slate-900">
            <Crown className="w-4 h-4 text-[#4338CA]" />
            <span>Upgrade to Pro</span>
          </div>
          <ul className="text-[10px] text-slate-600 space-y-1 pl-1 font-medium">
            <li className="flex items-center gap-1.5">
              <span className="w-1 h-1 rounded-full bg-[#4338CA]" />
              Unlimited resumes
            </li>
            <li className="flex items-center gap-1.5">
              <span className="w-1 h-1 rounded-full bg-[#4338CA]" />
              Advanced AI feedback
            </li>
            <li className="flex items-center gap-1.5">
              <span className="w-1 h-1 rounded-full bg-[#4338CA]" />
              Premium templates
            </li>
            <li className="flex items-center gap-1.5">
              <span className="w-1 h-1 rounded-full bg-[#4338CA]" />
              Interview coach
            </li>
          </ul>
          <Link
            href="/dashboard/settings?tab=billing"
            className="w-full py-2 px-3 bg-gradient-to-r from-[#4338CA] to-[#6366F1] hover:from-[#3730A3] hover:to-[#4F46E5] text-white text-[11px] font-extrabold rounded-xl flex items-center justify-center gap-1 transition-all shadow-xs"
          >
            <span>Upgrade Now</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </div>

      {/* Footer Settings & Profile Section */}
      <div className="pt-2 border-t border-slate-200/60 space-y-2 text-left">
        <div className="space-y-0.5">
          <Link
            href="/dashboard/settings"
            className="flex items-center gap-2.5 px-3 py-1.5 rounded-xl text-xs font-semibold text-slate-600 hover:text-slate-900 hover:bg-white transition-colors"
          >
            <Settings className="w-4 h-4 text-slate-400" />
            <span>Settings</span>
          </Link>
          <button
            onClick={() => router.push("/dashboard/settings?tab=support")}
            className="w-full flex items-center gap-2.5 px-3 py-1.5 rounded-xl text-xs font-semibold text-slate-600 hover:text-slate-900 hover:bg-white transition-colors text-left"
          >
            <HelpCircle className="w-4 h-4 text-slate-400" />
            <span>Help & Support</span>
          </button>
        </div>

        {/* User Quote / Slogan Footer */}
        <div className="px-2 pt-1.5 border-t border-slate-200/50">
          <p className="text-[9.5px] text-slate-400 italic leading-snug">
            * A better resume opens bigger opportunities.
          </p>
        </div>
      </div>
    </aside>
  );
};

