"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

interface ProfileFormProps {
  user: {
    sub: string;
    email: string;
    name?: string;
    avatar?: string;
  };
}

export default function ProfileForm({ user }: ProfileFormProps) {
  const router = useRouter();

  const [form, setForm] = useState({ name: "", email: "" });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  // New avatar state
  const [avatar, setAvatar] = useState<string | null>(user.avatar || null);
  const [preview, setPreview] = useState<string | null>(null);
  const [savingAvatar, setSavingAvatar] = useState(false);

  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [pwStatus, setPwStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [pwMessage, setPwMessage] = useState("");

  useEffect(() => {
    // Initial fetch to populate form values
    fetch("/api/profile/me")
      .then(res => res.json())
      .then(data => {
        setForm({ name: data.name || "", email: data.email || "" });
        setAvatar(data.avatar || null);
      });
  }, []);

  // --- Avatar Upload ---
  const handleAvatarChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setPreview(URL.createObjectURL(file));
    await uploadAvatar(file);
  };

  const uploadAvatar = async (file: File) => {
    setSavingAvatar(true);
    try {
      const formData = new FormData();
      formData.append("avatar", file);

      const res = await fetch("/api/profile/avatar", {
        method: "POST",
        body: formData,
      });

      if (!res.ok) {
        const text = await res.text();
        throw new Error(text || "Upload failed");
      }

      const data = await res.json();
      setAvatar(data.avatar);   // Update the main avatar state
      setPreview(null);         // Reset preview
      setMessage("Avatar updated successfully");

      router.refresh();         // Refresh AdminHeader immediately

    } catch (err: any) {
      alert(err.message || "Upload failed");
    } finally {
      setSavingAvatar(false);
    }
  };

  // --- Save Profile (name/email) ---
  const saveProfile = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/profile", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.message || "Failed to update profile");
      }

      setMessage("Profile updated successfully");
    } catch (err: any) {
      setMessage(err.message);
    } finally {
      setLoading(false);
    }
  };

  // --- Password change ---
  const handlePasswordChange = async () => {
    setPwStatus("loading");
    setPwMessage("");

    try {
      const res = await fetch("/api/profile/password", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ currentPassword, newPassword }),
      });

      const data = await res.json();

      if (!res.ok) {
        setPwStatus("error");
        setPwMessage(data.message || "Failed to update password");
        return;
      }

      setPwStatus("success");
      setPwMessage("Password changed. Redirecting to login...");
      setTimeout(() => router.push("/login"), 1200);

      setCurrentPassword("");
      setNewPassword("");
    } catch {
      setPwStatus("error");
      setPwMessage("Network error");
    }
  };

  return (
    <div className="space-y-5 text-[#553030]">
      {/* Avatar */}
      <div className="flex items-center gap-4 mb-4">
        <img
          src={preview || avatar || "/avatar-placeholder.png"}
          alt="Avatar"
          className="h-28 w-28 rounded-full border object-cover"
        />
        <label className="cursor-pointer text-sm font-medium">
          Change avatar
          <input
            type="file"
            accept="image/*"
            hidden
            onChange={handleAvatarChange}
          />
        </label>
      </div>

      {/* Profile Info */}
      <h3 className="font-semibold">Profile Information</h3>
      <div>
        <label className="block text-sm font-medium mb-1">Name</label>
        <input
          type="text"
          value={form.name}
          onChange={e => setForm({ ...form, name: e.target.value })}
          className="w-full rounded-md border px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#553030]/30"
        />
        <label className="block text-sm font-medium mb-1 mt-2">Email</label>
        <input
          type="email"
          value={form.email}
          onChange={e => setForm({ ...form, email: e.target.value })}
          className="w-full rounded-md border px-3 py-2 text-sm"
        />
      </div>

      <button
        type="button"
        disabled={loading}
        onClick={saveProfile}
        className="rounded-md bg-[#553030] px-5 py-2 text-sm font-semibold text-white hover:opacity-90 disabled:opacity-50"
      >
        {loading ? "Saving..." : "Save Changes"}
      </button>

      {/* Password */}
      <hr className="my-6" />
      <h3 className="font-semibold">Change Password</h3>
      <div className="space-y-3">
        <input
          type="password"
          placeholder="Current password"
          value={currentPassword}
          onChange={e => setCurrentPassword(e.target.value)}
          className="w-full border rounded-md px-3 py-2 text-sm"
        />
        <input
          type="password"
          placeholder="New password"
          value={newPassword}
          onChange={e => setNewPassword(e.target.value)}
          className="w-full border rounded-md px-3 py-2 text-sm"
        />
        {pwStatus === "success" && <p className="text-green-600">{pwMessage}</p>}
        {pwStatus === "error" && <p className="text-red-600">{pwMessage}</p>}
        <button
          type="button"
          disabled={pwStatus === "loading"}
          onClick={handlePasswordChange}
          className="rounded-md bg-[#553030] text-white px-4 py-2 text-sm hover:opacity-90 disabled:opacity-50"
        >
          {pwStatus === "loading" ? "Updating..." : "Update Password"}
        </button>
      </div>

      {message && <p className="text-sm text-center text-green-600">{message}</p>}


       <div className="flex justify-center items-center gap-3 pt-2">
         <button
               type="button"
               onClick={() => router.push("/admin")}
               className="text-[#553030] bg-white px-5 py-1.5 rounded-md border border-[#553030]"
            >
              Cancel
            </button>
      </div>
    </div>
  );
}
