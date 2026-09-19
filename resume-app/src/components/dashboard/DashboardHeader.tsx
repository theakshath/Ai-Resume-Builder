"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { Search, Bell, Menu, Sparkles, Moon, Sun, X, Check } from "lucide-react";
import { useAuth } from "@/lib/firebase/context";

export interface DashboardHeaderProps {
  onOpenMobileMenu?: () => void;
}

/** Derive initials from a display name or email */
function getInitials(name: string): string {
  if (!name) return "?";
  const parts = name.trim().split(/\s+/);
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
}

/** Sample notification data — replace with real notifications when backend is ready */
const DEMO_NOTIFICATIONS = [
  { id: 1, title: "Resume analyzed", body: "Your resume scored 88% ATS compatibility.", time: "2m ago", read: false },
  { id: 2, title: "Template applied", body: "Tech Elite template is now active.", time: "1h ago", read: false },
  { id: 3, title: "Tips unlocked", body: "5 new career tips available in Career Resources.", time: "3h ago", read: true },
];

export const DashboardHeader: React.FC<DashboardHeaderProps> = ({ onOpenMobileMenu }) => {
  const { user, profile, loading } = useAuth();
  const [darkMode, setDarkMode] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [notifications, setNotifications] = useState(DEMO_NOTIFICATIONS);

  // Sync dark mode with html element
  useEffect(() => {
    const root = document.documentElement;
    if (darkMode) {
      root.classList.add("dark");
    } else {
      root.classList.remove("dark");
    }
  }, [darkMode]);

  // Close notification panel on outside click
  useEffect(() => {
    if (!showNotifications) return;
    const handler = (e: MouseEvent) => {
      const panel = document.getElementById("notif-panel");
      const btn = document.getElementById("notif-btn");
      if (panel && !panel.contains(e.target as Node) && btn && !btn.contains(e.target as Node)) {
        setShowNotifications(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [showNotifications]);

  // Derive display name from Firebase user (priority: profile > displayName > email prefix)
  const displayName = !loading
    ? (profile?.fullName ||
       user?.displayName ||
       (user?.email ? user.email.split("@")[0] : ""))
    : "";

  const initials = getInitials(displayName);
  const unreadCount = notifications.filter((n) => !n.read).length;

  const markAllRead = () => setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));

  return (
    <header className="h-16 bg-white border-b border-slate-200/80 flex items-center justify-between px-4 sm:px-6 sticky top-0 z-40 shadow-2xs">
      {/* Left: Mobile Toggle + Logo */}
      <div className="flex items-center gap-3">
        <button
          onClick={onOpenMobileMenu}
          className="md:hidden p-1.5 rounded-lg text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition-colors"
          aria-label="Open menu"
        >
          <Menu className="w-5 h-5" />
        </button>

        <Link href="/" className="flex items-center gap-2 group">
          <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-[#4338CA] to-[#6366F1] text-white flex items-center justify-center shadow-sm group-hover:scale-105 transition-transform">
            <Sparkles className="w-4 h-4 text-white fill-current" />
          </div>
          <span className="font-black text-lg text-slate-900 tracking-tight leading-none">
            Resume<span className="text-[#4338CA]">AI</span>
          </span>
        </Link>
      </div>

      {/* Center: Search Bar */}
      <div className="hidden md:flex items-center flex-1 max-w-md mx-6">
        <div className="relative w-full">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
          <input
            type="text"
            placeholder="Search templates, tips, or tools..."
            className="w-full pl-9 pr-14 py-1.5 bg-slate-50 border border-slate-200/90 rounded-xl text-xs text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-[#4338CA]/20 focus:border-[#4338CA] transition-all"
          />
          <kbd className="absolute right-2.5 top-1/2 -translate-y-1/2 px-1.5 py-0.5 bg-white border border-slate-200 rounded-md text-[9.5px] font-semibold text-slate-400 shadow-2xs">
            Ctrl + K
          </kbd>
        </div>
      </div>

      {/* Right: Notification Bell, Dark Mode & User Avatar */}
      <div className="flex items-center gap-3">

        {/* ── Notification Bell ── */}
        <div className="relative">
          <button
            id="notif-btn"
            onClick={() => setShowNotifications((v) => !v)}
            className="relative p-2 text-slate-500 hover:text-slate-900 rounded-xl hover:bg-slate-100 transition-colors"
            aria-label="Notifications"
          >
            <Bell className="w-[18px] h-[18px]" />
            {unreadCount > 0 && (
              <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-[#EF4444] ring-2 ring-white animate-pulse" />
            )}
          </button>

          {/* Notification Dropdown Panel */}
          {showNotifications && (
            <div
              id="notif-panel"
              className="absolute right-0 top-full mt-2 w-80 bg-white border border-slate-200 rounded-2xl shadow-xl z-50 overflow-hidden"
            >
              <div className="flex items-center justify-between px-4 py-3 border-b border-slate-100">
                <span className="text-xs font-black text-slate-900">
                  Notifications
                  {unreadCount > 0 && (
                    <span className="ml-2 px-1.5 py-0.5 text-[10px] font-bold bg-[#4338CA] text-white rounded-full">
                      {unreadCount}
                    </span>
                  )}
                </span>
                <div className="flex items-center gap-2">
                  {unreadCount > 0 && (
                    <button
                      onClick={markAllRead}
                      className="text-[11px] text-[#4338CA] font-semibold hover:underline flex items-center gap-1"
                    >
                      <Check className="w-3 h-3" /> Mark all read
                    </button>
                  )}
                  <button
                    onClick={() => setShowNotifications(false)}
                    className="p-0.5 rounded hover:bg-slate-100 text-slate-400"
                    aria-label="Close notifications"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              <div className="divide-y divide-slate-50 max-h-72 overflow-y-auto">
                {notifications.map((n) => (
                  <div
                    key={n.id}
                    className={`px-4 py-3 flex gap-3 items-start transition-colors ${
                      n.read ? "opacity-60" : "bg-indigo-50/40"
                    }`}
                  >
                    <div className={`w-2 h-2 rounded-full mt-1.5 shrink-0 ${n.read ? "bg-slate-300" : "bg-[#4338CA]"}`} />
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-bold text-slate-900">{n.title}</p>
                      <p className="text-[11px] text-slate-500 mt-0.5 leading-snug">{n.body}</p>
                    </div>
                    <span className="text-[10px] text-slate-400 shrink-0">{n.time}</span>
                  </div>
                ))}
              </div>

              <div className="px-4 py-2.5 border-t border-slate-100 text-center">
                <button className="text-[11px] text-[#4338CA] font-semibold hover:underline">
                  View all notifications
                </button>
              </div>
            </div>
          )}
        </div>

        {/* ── Dark Mode Toggle ── */}
        <button
          onClick={() => setDarkMode((d) => !d)}
          className="p-2 text-slate-500 hover:text-slate-900 rounded-xl hover:bg-slate-100 transition-colors"
          aria-label={darkMode ? "Switch to light mode" : "Switch to dark mode"}
          title={darkMode ? "Light mode" : "Dark mode"}
        >
          {darkMode ? <Sun className="w-[18px] h-[18px]" /> : <Moon className="w-[18px] h-[18px]" />}
        </button>

        {/* ── User Profile Pill ── */}
        <div className="flex items-center gap-2 pl-2 border-l border-slate-200/80">
          {/* Avatar: shows photo if available, otherwise initials */}
          {user?.photoURL ? (
            <img
              src={user.photoURL}
              alt={displayName}
              className="w-8 h-8 rounded-full object-cover shadow-xs shrink-0"
            />
          ) : (
            <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-[#4338CA] to-[#6366F1] text-white font-bold text-xs flex items-center justify-center shadow-xs shrink-0 select-none">
              {loading ? "…" : initials}
            </div>
          )}

          <div className="hidden md:flex flex-col text-left leading-tight">
            <span className="text-xs font-black text-slate-900 max-w-[120px] truncate">
              {loading ? "Loading…" : displayName || "User"}
            </span>
            <span className="text-[10px] text-slate-400 font-semibold">Free Plan</span>
          </div>
        </div>
      </div>
    </header>
  );
};
