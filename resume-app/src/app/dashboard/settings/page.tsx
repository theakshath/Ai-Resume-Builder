"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/Card";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { Toast } from "@/components/ui/Toast";
import { Avatar } from "@/components/ui/Avatar";
import {
  User,
  Mail,
  Phone,
  MapPin,
  Briefcase,
  Shield,
  KeyRound,
  CreditCard,
  Bell,
  Sliders,
  AlertTriangle,
  LogOut,
  CheckCircle2,
  Lock,
  Loader2,
  Trash2,
} from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { isMockEnvironment } from "@/lib/env";

export default function SettingsPage() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<"profile" | "account" | "preferences" | "security" | "subscription" | "danger">("profile");

  // Profile Form State
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [location, setLocation] = useState("");
  const [title, setTitle] = useState("");
  const [isSavingProfile, setIsSavingProfile] = useState(false);

  // Security Form State
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isUpdatingPassword, setIsUpdatingPassword] = useState(false);

  // Preferences State
  const [defaultTemplate, setDefaultTemplate] = useState("executive-clean");
  const [defaultLanguage, setDefaultLanguage] = useState("English (US)");
  const [aiSuggestions, setAiSuggestions] = useState(true);
  const [emailNotifications, setEmailNotifications] = useState(true);

  // Danger Zone Modal State
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [deleteConfirmationText, setDeleteConfirmationText] = useState("");

  // Toast Notification State
  const [toast, setToast] = useState<{ type: "success" | "error"; title: string; message: string } | null>(null);

  useEffect(() => {
    loadUserProfile();
  }, []);

  const loadUserProfile = async () => {
    try {
      const activeSessionRaw = localStorage.getItem("active_user_session");
      let activeUid = "";
      if (activeSessionRaw) {
        try {
          const parsed = JSON.parse(activeSessionRaw);
          activeUid = parsed.id || parsed.uid || "";
          if (parsed.email) setEmail(parsed.email);
          if (parsed.fullName) setFullName(parsed.fullName);
        } catch {}
      }

      if (activeUid) {
        const { getUserProfileDoc } = await import("@/lib/firebase/firestore");
        const firestoreProfile = await getUserProfileDoc(activeUid);
        if (firestoreProfile) {
          if (firestoreProfile.fullName) setFullName(firestoreProfile.fullName);
          if (firestoreProfile.email) setEmail(firestoreProfile.email);
          if (firestoreProfile.phone) setPhone(firestoreProfile.phone);
          if (firestoreProfile.location) setLocation(firestoreProfile.location);
          if (firestoreProfile.professionalTitle) setTitle(firestoreProfile.professionalTitle);
        }
      }
    } catch (err) {
      console.error("Failed to load user profile:", err);
    }
  };

  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSavingProfile(true);

    try {
      const activeSessionRaw = localStorage.getItem("active_user_session");
      let activeUid = "";
      if (activeSessionRaw) {
        try {
          const parsed = JSON.parse(activeSessionRaw);
          activeUid = parsed.id || parsed.uid || "";
        } catch {}
      }

      if (activeUid) {
        const { updateUserProfileDoc } = await import("@/lib/firebase/firestore");
        await updateUserProfileDoc(activeUid, {
          email: email.trim(),
          fullName: fullName.trim(),
          phone: phone.trim(),
          location: location.trim(),
          professionalTitle: title.trim(),
        });

        // Sync active user session metadata
        if (activeSessionRaw) {
          const parsed = JSON.parse(activeSessionRaw);
          parsed.fullName = fullName.trim();
          localStorage.setItem("active_user_session", JSON.stringify(parsed));
        }
      }

      setToast({
        type: "success",
        title: "Profile Updated",
        message: "Your profile information has been successfully saved to Firestore.",
      });
    } catch (err: any) {
      setToast({
        type: "error",
        title: "Update Failed",
        message: err.message || "Failed to update profile.",
      });
    } finally {
      setIsSavingProfile(false);
    }
  };

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (newPassword.length < 8) {
      setToast({
        type: "error",
        title: "Weak Password",
        message: "New password must be at least 8 characters long.",
      });
      return;
    }

    if (newPassword !== confirmPassword) {
      setToast({
        type: "error",
        title: "Mismatch Password",
        message: "Passwords do not match.",
      });
      return;
    }

    setIsUpdatingPassword(true);

    try {
      const supabase = createClient();
      const { error } = await supabase.auth.updateUser({ password: newPassword });

      if (error) throw error;

      setNewPassword("");
      setConfirmPassword("");
      setToast({
        type: "success",
        title: "Password Updated",
        message: "Your password has been changed securely.",
      });
    } catch (err: any) {
      setToast({
        type: "error",
        title: "Update Error",
        message: err.message || "Could not update password.",
      });
    } finally {
      setIsUpdatingPassword(false);
    }
  };

  const handleSignOut = async () => {
    try {
      const supabase = createClient();
      await supabase.auth.signOut();
    } catch {}
    router.push("/login");
    router.refresh();
  };

  const handleDeleteAccount = async () => {
    if (deleteConfirmationText !== "DELETE") {
      setToast({
        type: "error",
        title: "Confirmation Required",
        message: 'Please type "DELETE" to confirm account removal.',
      });
      return;
    }

    try {
      const supabase = createClient();
      await supabase.auth.signOut();
    } catch {}

    setDeleteModalOpen(false);
    router.push("/login");
  };

  const navTabs = [
    { id: "profile", label: "Profile", icon: User },
    { id: "account", label: "Account", icon: Shield },
    { id: "preferences", label: "Preferences", icon: Sliders },
    { id: "security", label: "Security", icon: KeyRound },
    { id: "subscription", label: "Subscription", icon: CreditCard },
    { id: "danger", label: "Danger Zone", icon: AlertTriangle },
  ] as const;

  return (
    <div className="space-y-6 bg-[#FAF9F6]">
      {/* Top Header */}
      <div className="pb-4 border-b border-[#E4E4E7]">
        <h1 className="text-2xl font-extrabold text-[#09090B] tracking-tight">Account & Settings</h1>
        <p className="text-xs text-[#52525B]">
          Manage your personal profile, security preferences, and subscription plan.
        </p>
      </div>

      {/* Tabs Layout */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
        {/* Navigation Sidebar Tabs */}
        <div className="md:col-span-3 space-y-1">
          {navTabs.map((tab) => {
            const Icon = tab.icon;
            const isSelected = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`w-full flex items-center gap-2.5 px-3.5 py-2.5 rounded-lg text-xs font-semibold transition-all text-left ${
                  isSelected
                    ? "bg-[#EEF2FF] text-[#4F46E5] font-bold shadow-2xs"
                    : tab.id === "danger"
                    ? "text-[#EF4444] hover:bg-[#FEF2F2]"
                    : "text-[#52525B] hover:text-[#09090B] hover:bg-white"
                }`}
              >
                <Icon
                  className={`w-4 h-4 ${
                    isSelected
                      ? "text-[#4F46E5]"
                      : tab.id === "danger"
                      ? "text-[#EF4444]"
                      : "text-[#71717A]"
                  }`}
                />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* Tab Content Panel */}
        <div className="md:col-span-9">
          {/* TAB 1: PROFILE */}
          {activeTab === "profile" && (
            <Card className="border-[#E4E4E7] bg-white p-6 space-y-6 shadow-xs">
              <div className="flex items-center gap-4 pb-4 border-b border-[#F4F4F5]">
                <Avatar name={fullName} size="lg" />
                <div className="space-y-1">
                  <h3 className="text-base font-bold text-[#09090B]">{fullName}</h3>
                  <p className="text-xs text-[#52525B]">{email}</p>
                </div>
              </div>

              <form onSubmit={handleSaveProfile} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <Input
                    label="Full Name"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    leftIcon={<User className="w-4 h-4" />}
                    required
                  />
                  <Input
                    label="Email Address"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    leftIcon={<Mail className="w-4 h-4" />}
                    required
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <Input
                    label="Phone Number"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    leftIcon={<Phone className="w-4 h-4" />}
                  />
                  <Input
                    label="Location"
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    leftIcon={<MapPin className="w-4 h-4" />}
                  />
                </div>

                <Input
                  label="Professional Title"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  leftIcon={<Briefcase className="w-4 h-4" />}
                />

                <div className="flex justify-end pt-2 border-t border-[#F4F4F5]">
                  <Button
                    variant="primary"
                    size="md"
                    type="submit"
                    isLoading={isSavingProfile}
                    className="font-bold px-6 shadow-xs"
                  >
                    Save Changes
                  </Button>
                </div>
              </form>
            </Card>
          )}

          {/* TAB 2: ACCOUNT */}
          {activeTab === "account" && (
            <Card className="border-[#E4E4E7] bg-white p-6 space-y-6 shadow-xs">
              <div className="space-y-1 pb-4 border-b border-[#F4F4F5]">
                <h3 className="text-base font-bold text-[#09090B]">Account Status & Details</h3>
                <p className="text-xs text-[#52525B]">Overview of your ResumeAI account metadata.</p>
              </div>

              <div className="space-y-3 text-xs">
                <div className="flex justify-between items-center py-2 border-b border-[#F4F4F5]">
                  <span className="font-semibold text-[#52525B]">Account Status</span>
                  <Badge variant="success" size="sm">Active</Badge>
                </div>
                <div className="flex justify-between items-center py-2 border-b border-[#F4F4F5]">
                  <span className="font-semibold text-[#52525B]">Membership Tier</span>
                  <Badge variant="indigo" size="sm">Pro Member</Badge>
                </div>
                <div className="flex justify-between items-center py-2 border-b border-[#F4F4F5]">
                  <span className="font-semibold text-[#52525B]">Email Verification</span>
                  <span className="flex items-center gap-1 text-[#059669] font-bold">
                    <CheckCircle2 className="w-3.5 h-3.5" /> Verified
                  </span>
                </div>
                <div className="flex justify-between items-center py-2">
                  <span className="font-semibold text-[#52525B]">Member Since</span>
                  <span className="text-[#09090B] font-bold">August 2026</span>
                </div>
              </div>
            </Card>
          )}

          {/* TAB 3: PREFERENCES */}
          {activeTab === "preferences" && (
            <Card className="border-[#E4E4E7] bg-white p-6 space-y-6 shadow-xs">
              <div className="space-y-1 pb-4 border-b border-[#F4F4F5]">
                <h3 className="text-base font-bold text-[#09090B]">User Preferences</h3>
                <p className="text-xs text-[#52525B]">Customize your AI assistant defaults and notifications.</p>
              </div>

              <div className="space-y-4 text-xs">
                <div className="space-y-1.5">
                  <label className="font-bold text-[#09090B]">Default Resume Template</label>
                  <select
                    value={defaultTemplate}
                    onChange={(e) => setDefaultTemplate(e.target.value)}
                    className="w-full p-2.5 bg-white border border-[#E4E4E7] rounded-lg text-xs font-semibold text-[#09090B]"
                  >
                    <option value="executive-clean">Executive Clean</option>
                    <option value="tech-specialist">Tech Specialist</option>
                    <option value="minimalist-mono">Minimalist Mono</option>
                  </select>
                </div>

                <div className="space-y-1.5">
                  <label className="font-bold text-[#09090B]">Default Resume Language</label>
                  <select
                    value={defaultLanguage}
                    onChange={(e) => setDefaultLanguage(e.target.value)}
                    className="w-full p-2.5 bg-white border border-[#E4E4E7] rounded-lg text-xs font-semibold text-[#09090B]"
                  >
                    <option value="English (US)">English (US)</option>
                    <option value="English (UK)">English (UK)</option>
                    <option value="Spanish">Spanish</option>
                  </select>
                </div>

                <div className="flex items-center justify-between py-3 border-t border-[#F4F4F5]">
                  <div>
                    <h4 className="font-bold text-[#09090B]">AI Auto-Suggestions</h4>
                    <p className="text-[#71717A]">Automatically highlight weak bullet points in editor.</p>
                  </div>
                  <input
                    type="checkbox"
                    checked={aiSuggestions}
                    onChange={(e) => setAiSuggestions(e.target.checked)}
                    className="w-4 h-4 text-[#4F46E5] rounded accent-[#4F46E5]"
                  />
                </div>

                <div className="flex items-center justify-between py-3 border-t border-[#F4F4F5]">
                  <div>
                    <h4 className="font-bold text-[#09090B]">Email Digest Notifications</h4>
                    <p className="text-[#71717A]">Receive weekly application & ATS scoring summaries.</p>
                  </div>
                  <input
                    type="checkbox"
                    checked={emailNotifications}
                    onChange={(e) => setEmailNotifications(e.target.checked)}
                    className="w-4 h-4 text-[#4F46E5] rounded accent-[#4F46E5]"
                  />
                </div>
              </div>

              <div className="flex justify-end pt-2 border-t border-[#F4F4F5]">
                <Button
                  variant="primary"
                  size="md"
                  onClick={() =>
                    setToast({
                      type: "success",
                      title: "Preferences Saved",
                      message: "Your preferences have been updated.",
                    })
                  }
                  className="font-bold px-6 shadow-xs"
                >
                  Save Preferences
                </Button>
              </div>
            </Card>
          )}

          {/* TAB 4: SECURITY */}
          {activeTab === "security" && (
            <Card className="border-[#E4E4E7] bg-white p-6 space-y-6 shadow-xs">
              <div className="space-y-1 pb-4 border-b border-[#F4F4F5]">
                <h3 className="text-base font-bold text-[#09090B]">Security & Credentials</h3>
                <p className="text-xs text-[#52525B]">Update password and manage active sessions.</p>
              </div>

              <form onSubmit={handleChangePassword} className="space-y-4 max-w-md">
                <Input
                  label="New Password"
                  type="password"
                  placeholder="Enter new password (8+ chars)"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  leftIcon={<Lock className="w-4 h-4" />}
                  required
                />

                <Input
                  label="Confirm New Password"
                  type="password"
                  placeholder="Re-enter new password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  leftIcon={<Lock className="w-4 h-4" />}
                  required
                />

                <Button
                  variant="primary"
                  size="md"
                  type="submit"
                  isLoading={isUpdatingPassword}
                  className="font-bold shadow-xs"
                >
                  Change Password
                </Button>
              </form>

              <div className="pt-6 border-t border-[#F4F4F5] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div>
                  <h4 className="text-xs font-bold text-[#09090B]">Active Sessions</h4>
                  <p className="text-xs text-[#71717A]">Sign out from all devices and browsers.</p>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleSignOut}
                  leftIcon={<LogOut className="w-3.5 h-3.5 text-[#EF4444]" />}
                  className="text-xs text-[#EF4444] border-[#FCA5A5] hover:bg-[#FEF2F2]"
                >
                  Sign Out All Devices
                </Button>
              </div>
            </Card>
          )}

          {/* TAB 5: SUBSCRIPTION */}
          {activeTab === "subscription" && (
            <Card className="border-[#E4E4E7] bg-white p-6 space-y-6 shadow-xs">
              <div className="space-y-1 pb-4 border-b border-[#F4F4F5]">
                <h3 className="text-base font-bold text-[#09090B]">Subscription & Billing</h3>
                <p className="text-xs text-[#52525B]">Manage your active membership plan and payment methods.</p>
              </div>

              <div className="p-4 bg-[#EEF2FF]/50 border border-[#E0E7FF] rounded-xl flex items-center justify-between">
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-[#4F46E5]">Current Plan</span>
                  <h4 className="text-lg font-extrabold text-[#09090B]">Pro Unlimited Plan</h4>
                  <p className="text-xs text-[#52525B]">Billed monthly • Renews Sept 2026</p>
                </div>
                <Badge variant="success" size="md">Active</Badge>
              </div>

              <div className="pt-2">
                <Button
                  variant="outline"
                  size="md"
                  onClick={() =>
                    setToast({
                      type: "success",
                      title: "Billing Portal",
                      message: "Opening secure payment management portal...",
                    })
                  }
                  className="font-bold"
                >
                  Manage Billing & Invoices
                </Button>
              </div>
            </Card>
          )}

          {/* TAB 6: DANGER ZONE */}
          {activeTab === "danger" && (
            <Card className="border-[#FCA5A5] bg-[#FFF5F5] p-6 space-y-4 shadow-xs">
              <div className="space-y-1 pb-3 border-b border-[#FECDD3]">
                <h3 className="text-base font-bold text-[#991B1B]">Danger Zone</h3>
                <p className="text-xs text-[#9F1239]">Irreversible actions for your ResumeAI account.</p>
              </div>

              <div className="flex items-center justify-between pt-2">
                <div>
                  <h4 className="text-xs font-bold text-[#09090B]">Delete Account</h4>
                  <p className="text-xs text-[#71717A]">
                    Permanently delete your profile, saved resumes, ATS history, and mock practice data.
                  </p>
                </div>
                <Button
                  variant="primary"
                  size="sm"
                  onClick={() => setDeleteModalOpen(true)}
                  leftIcon={<Trash2 className="w-3.5 h-3.5" />}
                  className="bg-[#DC2626] hover:bg-[#B91C1C] text-white font-bold"
                >
                  Delete Account
                </Button>
              </div>
            </Card>
          )}
        </div>
      </div>

      {/* Delete Account Confirmation Modal */}
      {deleteModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-xs flex items-center justify-center p-4">
          <Card className="max-w-md w-full bg-white p-6 space-y-4 shadow-xl border-[#E4E4E7]">
            <div className="flex items-center gap-3 text-[#DC2626]">
              <div className="p-2 bg-[#FEF2F2] rounded-lg">
                <AlertTriangle className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-[#09090B]">Confirm Account Deletion</h3>
            </div>
            <p className="text-xs text-[#52525B]">
              This action is <strong className="text-[#DC2626]">permanent and cannot be undone</strong>. Please type{" "}
              <strong className="text-[#09090B]">DELETE</strong> below to confirm.
            </p>

            <Input
              placeholder='Type "DELETE"'
              value={deleteConfirmationText}
              onChange={(e) => setDeleteConfirmationText(e.target.value)}
              autoFocus
            />

            <div className="flex items-center justify-end gap-2 pt-2 border-t border-[#F4F4F5]">
              <Button variant="outline" size="sm" onClick={() => setDeleteModalOpen(false)}>
                Cancel
              </Button>
              <Button
                variant="primary"
                size="sm"
                onClick={handleDeleteAccount}
                disabled={deleteConfirmationText !== "DELETE"}
                className="bg-[#DC2626] hover:bg-[#B91C1C] text-white font-bold disabled:opacity-50"
              >
                Delete Account Permanently
              </Button>
            </div>
          </Card>
        </div>
      )}

      {/* Toast Notification */}
      {toast && (
        <div className="fixed bottom-6 right-6 z-50 max-w-sm">
          <Toast
            type={toast.type}
            title={toast.title}
            message={toast.message}
            onClose={() => setToast(null)}
          />
        </div>
      )}
    </div>
  );
}
