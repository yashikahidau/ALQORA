"use client";

import { useState } from "react";
import { toast } from "sonner";

interface Props {
  isOpen: boolean;
  onClose: () => void;

  onSave: (
    currentPassword: string,
    newPassword: string
  ) => Promise<void>;
}

export default function ChangePasswordModal({
  isOpen,
  onClose,
  onSave,
}: Props) {

  const [currentPassword, setCurrentPassword] =
    useState("");

  const [newPassword, setNewPassword] =
    useState("");

  const [confirmPassword, setConfirmPassword] =
    useState("");

  const [saving, setSaving] =
    useState(false);

  if (!isOpen) return null;

  const handleSubmit = async () => {

    if (newPassword !== confirmPassword) {
      toast.error("Passwords do not match.");
      return;
    }

    setSaving(true);

    await onSave(
      currentPassword,
      newPassword
    );

    setSaving(false);

    setCurrentPassword("");
    setNewPassword("");
    setConfirmPassword("");

    onClose();
  };

  return (

    <div className="fixed inset-0 z-[9999] bg-black/40 backdrop-blur-sm flex items-center justify-center">

      <div className="w-full max-w-lg rounded-[36px] bg-[#FDFBF9] border border-[#E4D5CC] p-8 shadow-2xl">

        <h2 className="text-4xl font-light text-[#2D211D] mb-8 font-[family:var(--font-cormorant)]">
          Change Password
        </h2>

        <div className="space-y-5">

          <div>

            <label className="text-sm text-[#8D7569]">
              Current Password
            </label>

            <input
              type="password"
              value={currentPassword}
              onChange={(e)=>
                setCurrentPassword(e.target.value)
              }
              className="w-full mt-2 rounded-2xl border border-[#E4D5CC] p-4"
            />

          </div>

          <div>

            <label className="text-sm text-[#8D7569]">
              New Password
            </label>

            <input
              type="password"
              value={newPassword}
              onChange={(e)=>
                setNewPassword(e.target.value)
              }
              className="w-full mt-2 rounded-2xl border border-[#E4D5CC] p-4"
            />

          </div>

          <div>

            <label className="text-sm text-[#8D7569]">
              Confirm Password
            </label>

            <input
              type="password"
              value={confirmPassword}
              onChange={(e)=>
                setConfirmPassword(e.target.value)
              }
              className="w-full mt-2 rounded-2xl border border-[#E4D5CC] p-4"
            />

          </div>

        </div>

        <div className="flex justify-end gap-4 mt-8">

          <button
            onClick={onClose}
            className="px-6 py-3 rounded-full border border-[#E4D5CC]"
          >
            Cancel
          </button>

          <button

            disabled={saving}

            onClick={handleSubmit}

            className="px-6 py-3 rounded-full bg-[#7A2E3A] text-white"

          >

            {
              saving
                ? "Updating..."
                : "Update Password"
            }

          </button>

        </div>

      </div>

    </div>

  );
}