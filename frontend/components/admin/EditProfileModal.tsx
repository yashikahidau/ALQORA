"use client";

import { useEffect, useState } from "react";

interface Props {
  isOpen: boolean;
  onClose: () => void;

  profile: {
    name: string;
    email: string;
    role: string;
    badge: string;
  };

  onSave: (
    name: string,
    email: string
  ) => Promise<void>;
}

export default function EditProfileModal({
  isOpen,
  onClose,
  profile,
  onSave,
}: Props) {

  const [name, setName] =
    useState("");

  const [email, setEmail] =
    useState("");

  const [saving, setSaving] =
    useState(false);

  useEffect(() => {

    setName(profile.name);

    setEmail(profile.email);

  }, [profile]);

  if (!isOpen) return null;

  return (

    <div className="fixed inset-0 z-[9999] bg-black/40 backdrop-blur-sm flex items-center justify-center">

      <div className="w-full max-w-lg rounded-[36px] bg-[#FDFBF9] border border-[#E4D5CC] p-8 shadow-2xl">

        <h2 className="text-4xl font-light text-[#2D211D] mb-8 font-[family:var(--font-cormorant)]">
          Edit Profile
        </h2>

        <div className="space-y-6">

          <div>

            <label className="text-sm text-[#8D7569]">
              Name
            </label>

            <input
              value={name}
              onChange={(e)=>
                setName(e.target.value)
              }
              className="w-full mt-2 rounded-2xl border border-[#E4D5CC] p-4"
            />

          </div>

          <div>

            <label className="text-sm text-[#8D7569]">
              Email
            </label>

            <input
              value={email}
              onChange={(e)=>
                setEmail(e.target.value)
              }
              className="w-full mt-2 rounded-2xl border border-[#E4D5CC] p-4"
            />

          </div>

        </div>

        <div className="flex justify-end gap-4 mt-10">

          <button
            onClick={onClose}
            className="px-6 py-3 rounded-full border border-[#E4D5CC]"
          >
            Cancel
          </button>

          <button

            disabled={saving}

            onClick={async()=>{

              setSaving(true);

              await onSave(
                name,
                email
              );

              setSaving(false);

              onClose();

            }}

            className="px-6 py-3 rounded-full bg-[#7A2E3A] text-white"

          >

            {
              saving
              ? "Saving..."
              : "Save Changes"
            }

          </button>

        </div>

      </div>

    </div>

  );
}