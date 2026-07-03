"use client";

import { useEffect, useState } from "react";

interface User {
  _id: string;
  name: string;
  email: string;
  role: string;
  badge: string;
}

interface EditUserModalProps {
  isOpen: boolean;
  user: User | null;
  onClose: () => void;
  onSave: (
    userId: string,
    role: string,
    badge: string
  ) => Promise<void>;
}

export default function EditUserModal({
  isOpen,
  user,
  onClose,
  onSave,
}: EditUserModalProps) {

  const [role, setRole] =
    useState("");

  const [badge, setBadge] =
    useState("");

  const [loading, setLoading] =
    useState(false);

  useEffect(() => {

    if (user) {

      setRole(user.role);

      setBadge(user.badge);
    }

  }, [user]);

  if (!isOpen || !user) return null;

  const handleSave =
    async () => {

      try {

        setLoading(true);

        await onSave(
          user._id,
          role,
          badge
        );

        onClose();

      } catch (error) {

        console.error(error);

      } finally {

        setLoading(false);
      }
    };

  return (
    <div className="fixed inset-0 z-[9999] bg-black/40 backdrop-blur-sm flex items-center justify-center px-4">

      <div className="w-full max-w-xl rounded-[36px] border border-[#E4D5CC] bg-[#FDFBF9] p-8 shadow-2xl">

        <div className="flex items-center justify-between">

          <div>

            <p className="text-[10px] uppercase tracking-[0.35em] text-[#A17F72]">
              User Management
            </p>

            <h2 className="mt-2 text-4xl font-light font-[family:var(--font-cormorant)] text-[#2D211D]">
              Edit User
            </h2>

          </div>

          <button
            onClick={onClose}
            className="
h-10
w-10
rounded-full
border
border-[#E4D5CC]
transition-all
duration-300
hover:bg-[#2D211D]
hover:text-white
"
          >
            ✕
          </button>

        </div>

        <div className="mt-8 space-y-6">

          {/* Name */}

          <div>

            <label className="block text-xs uppercase tracking-[0.25em] text-[#A17F72] mb-2">
              Name
            </label>

            <input
              value={user.name}
              disabled
              className="w-full h-14 rounded-full border border-[#E4D5CC] px-5 bg-white"
            />

          </div>

          {/* Email */}

          <div>

            <label className="block text-xs uppercase tracking-[0.25em] text-[#A17F72] mb-2">
              Email
            </label>

            <input
              value={user.email}
              disabled
              className="w-full h-14 rounded-full border border-[#E4D5CC] px-5 bg-white"
            />

          </div>

          {/* Role */}

          <div>

            <label className="block text-xs uppercase tracking-[0.25em] text-[#A17F72] mb-2">
              Role
            </label>

            <select
              disabled={loading}
              value={role}
              onChange={(e) =>
                setRole(
                  e.target.value
                )
              }
              className="w-full h-14 rounded-full border border-[#E4D5CC] px-5 bg-white"
            >
              <option value="user">
                User
              </option>

              <option value="admin">
                Admin
              </option>

            </select>

          </div>

          {/* Badge */}

          <div>

            <label className="block text-xs uppercase tracking-[0.25em] text-[#A17F72] mb-2">
              Badge
            </label>

            <select
              disabled={loading}
              value={badge}
              onChange={(e) =>
                setBadge(
                  e.target.value
                )
              }
              className="w-full h-14 rounded-full border border-[#E4D5CC] px-5 bg-white"
            >
              <option value="Member">
                Member
              </option>

              <option value="Silver">
                Silver
              </option>

              <option value="Gold">
                Gold
              </option>

              <option value="Platinum">
                Platinum
              </option>

              <option value="Elite">
                Elite
              </option>

            </select>

          </div>

        </div>

        <div className="mt-10 flex gap-4">

          <button
            onClick={onClose}
            className="
flex-1
h-14
rounded-full
border
border-[#E4D5CC]
transition-all
duration-300
hover:bg-[#F5EEE8]
"
          >
            Cancel
          </button>

          <button
            onClick={handleSave}
            disabled={loading}
            className="
flex-1
h-14
rounded-full
bg-[#7A2E3A]
text-white
transition-all
duration-300
hover:bg-[#5F2430]
disabled:opacity-50
disabled:cursor-not-allowed
"
          >
            {loading
              ? "Saving Changes..."
              : "Save Changes"}
          </button>

        </div>

      </div>

    </div>
  );
}