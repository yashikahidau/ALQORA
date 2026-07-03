"use client";

import { useEffect, useState } from "react";
import {
  getAllUsers,
  updateUserRole,
  updateUserBadge,
  getUserDetails,
  deleteUser,
} from "@/lib/adminUserApi";
import { toast } from "sonner";

import EditUserModal from "@/components/admin/EditUserModal";
import UserDetailsModal from "@/components/admin/UserDetailsModal";

interface User {
  _id: string;
  name: string;
  email: string;
  role: string;
  badge: string;
  totalOrders: number;
  totalSpent: number;
  createdAt: string;
}

export default function UsersPage() {
  // --- KEEPING EVERY ORIGINAL STATE VARIABLE EXACTLY AS PROVIDED ---
  const [users, setUsers] = useState<User[]>([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [detailsOpen, setDetailsOpen] = useState(false);
  const [detailUser, setDetailUser] = useState<any>(null);
  const [userOrders, setUserOrders] = useState<any[]>([]);

  // --- EXACT ORIGINAL INITIAL LOAD FUNCTIONALITY ---
  useEffect(() => {
    const loadUsers = async () => {
      const response = await getAllUsers();
      if (response?.success) {
        setUsers(response.users);
      }
      setLoading(false);
    };
    loadUsers();
  }, []);

  // --- EXACT ORIGINAL SAVE FUNCTIONALITY ---
  const handleSaveUser = async (
    userId: string,
    role: string,
    badge: string
  ) => {
    await updateUserRole(userId, role);
    await updateUserBadge(userId, badge);
    const response = await getAllUsers();
    if (response.success) {
      setUsers(response.users);
    }
  };

  // --- EXACT ORIGINAL VIEW DETAILS FUNCTIONALITY ---
  const handleViewUser = async (userId: string) => {
    const response = await getUserDetails(userId);
    if (response?.success) {
      setDetailUser(response.user);
      setUserOrders(response.orders);
      setDetailsOpen(true);
    }
  };

  // --- EXACT ORIGINAL DELETE FUNCTIONALITY ---
  const handleDeleteUser = async (userId: string) => {
    const confirmed = window.confirm("Delete this user permanently?");
    if (!confirmed) return;

    const response = await deleteUser(userId);
    if (response?.success) {
      setUsers(users.filter((user) => user._id !== userId));


  toast.success(
    "User deleted successfully."
  );
    } else {
      toast.error(
        response?.error || "Failed to delete user."
      );
    }
  };

  // --- EXACT ORIGINAL FILTER FUNCTIONALITY ---
  const filteredUsers = users.filter((user) =>
    user.name.toLowerCase().includes(search.toLowerCase()) ||
    user.email.toLowerCase().includes(search.toLowerCase())
  );

  // --- PREMIUM TEXT LOADER SCREEN ---
  if (loading) {
    return (
      <div className="min-h-screen bg-[#F8F1EB] flex items-center justify-center">
        <p className="text-sm font-semibold tracking-[0.3em] uppercase text-[#7A2E3A] animate-pulse">
          Synchronizing Registry Vault...
        </p>
      </div>
    );
  }

  return (
    <main className="relative min-h-screen bg-[#F8F1EB] text-[#2D211D] overflow-hidden antialiased p-10">

      {/* LUXURY BACKGROUND BACKGROUND LAYER */}
      <div className="absolute top-0 left-0 h-[600px] w-[600px] rounded-full bg-[#E8C9B8]/30 blur-[150px] pointer-events-none" />
      <div className="absolute bottom-12 right-0 h-[500px] w-[500px] rounded-full bg-[#7A2E3A]/[0.04] blur-[160px] pointer-events-none" />

      <div className="relative z-10 max-w-[1600px] mx-auto px-6 md:px-12 lg:px-16 pt-24 pb-32">

        {/* RE-DESIGNED BRAND HEADER ZONE */}
        <header className="border-b border-[#E4D5CC] pb-10 flex flex-col md:flex-row md:items-end md:justify-between gap-6">
          <div>
            <div className="flex items-center gap-3 mb-4">
              <span className="h-[1px] w-10 bg-[#7A2E3A]" />
              <span className="text-[10px] uppercase tracking-[0.4em] text-[#7A2E3A] font-bold">
                Alqora Admin Hub
              </span>
            </div>
            <h1 className="text-[52px] sm:text-[72px] md:text-[88px] font-light leading-[0.95] tracking-[-0.04em] font-[family:var(--font-cormorant)]">
              Manage <span className="italic text-[#7A2E3A]">Users</span>
            </h1>
          </div>

          <div className="text-[11px] uppercase tracking-[0.2em] font-bold text-[#A17F72] mb-1">
            Active Records: <span className="text-[#2D211D] ml-1">{filteredUsers.length}</span>
          </div>
        </header>

        {/* CONTROLS SECTION */}
        <div className="mt-12 max-w-xl relative group">
          <input
            type="text"
            placeholder="Search users by name or email domains..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full h-[56px] rounded-full px-14 border border-[#E4D5CC] bg-white/70 outline-none transition-all duration-300 focus:border-[#7A2E3A] focus:bg-white focus:shadow-xl focus:shadow-[#7A2E3A]/5 text-sm font-semibold text-[#2D211D] placeholder-[#2D211D]/40"
          />
          <svg className="absolute left-6 top-1/2 -translate-y-1/2 w-4 h-4 text-[#A17F72]" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
        </div>

        {/* PREMIUM DATATABLE CONTAINER */}
        <div className="mt-8 bg-white/60 backdrop-blur-md rounded-[32px] overflow-hidden border border-[#E4D5CC] shadow-sm shadow-[#2D211D]/5">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse table-auto">
              <thead>
                <tr className="border-b border-[#E4D5CC] bg-[#2D211D]/[0.02]">
                  <th className="py-6 px-8 text-[11px] uppercase tracking-[0.2em] text-[#2D211D] font-bold w-[18%]">Name</th>
                  <th className="py-6 px-6 text-[11px] uppercase tracking-[0.2em] text-[#2D211D] font-bold w-[26%]">Email Address</th>
                  <th className="py-6 px-6 text-[11px] uppercase tracking-[0.2em] text-[#2D211D] font-bold text-center w-[12%]">Badge</th>
                  <th className="py-6 px-6 text-[11px] uppercase tracking-[0.2em] text-[#2D211D] font-bold text-center w-[10%]">Role</th>
                  <th className="py-6 px-6 text-[11px] uppercase tracking-[0.2em] text-[#2D211D] font-bold text-center w-[9%]">Orders</th>
                  <th className="py-6 px-6 text-[11px] uppercase tracking-[0.2em] text-[#2D211D] font-bold text-right w-[11%]">Spent</th>
                  <th className="py-6 px-8 text-[11px] uppercase tracking-[0.2em] text-[#2D211D] font-bold text-right w-[14%]">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#E4D5CC]/60">
                {filteredUsers.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="py-24 text-center text-sm font-medium text-[#A17F72]">
                      No profiles found matching your search parameters.
                    </td>
                  </tr>
                ) : (
                  filteredUsers.map((user) => (
                    <tr
                      key={user._id}
                      className="transition-colors duration-300 hover:bg-white/90 group/row"
                    >
                      {/* Name - Strengthened Font Weights */}
                      <td className="py-5 px-8 text-sm font-bold text-[#2D211D]">
                        {user.name}
                      </td>

                      {/* Email - High Density Contrast Text */}
                      <td className="py-5 px-6 text-sm font-medium text-[#2D211D]/80 tracking-wide">
                        {user.email}
                      </td>

                      {/* Badge Pill Configurator */}
                      <td className="py-5 px-6 text-center">
                        <span className={`inline-flex justify-center items-center px-4 py-1 rounded-full text-[10px] uppercase tracking-[0.15em] font-bold border min-w-[110px] text-center
                          ${user.role === "admin" ? "bg-[#7A2E3A] text-white border-[#7A2E3A]" : ""}
                          ${user.badge === "Silver" ? "bg-stone-200 text-stone-800 border-stone-300" : ""}
                          ${user.badge === "Member" ? "bg-white text-[#2D211D] border-[#E4D5CC]" : ""}
                        `}>
                          {user.role === "admin" ? "Administrator" : user.badge}
                        </span>
                      </td>

                      {/* Role Column */}
                      <td className="py-5 px-6 text-center text-[11px] uppercase tracking-widest font-bold text-[#2D211D]/80">
                        {user.role}
                      </td>

                      {/* Total Orders */}
                      <td className="py-5 px-6 text-center text-sm font-bold text-[#2D211D]">
                        {user.totalOrders}
                      </td>

                      {/* Total Spent Currency Fields */}
                      <td className="py-5 px-6 text-sm font-bold text-right text-[#2D211D]">
                        ₹{user.totalSpent.toLocaleString()}
                      </td>

                      {/* Safe Action Row Grid Defending Alignments */}
                      <td className="py-5 px-8 text-right">
                        <div className="flex items-center justify-end gap-3 w-full">

                          {/* VIEW BUTTON */}
                          <button
                            onClick={() => handleViewUser(user._id)}
                            className="h-[36px] px-4 rounded-full border border-[#E4D5CC] bg-white text-[#2D211D] text-[10px] font-bold uppercase tracking-[0.15em] transition-all duration-300 hover:bg-[#2D211D] hover:text-white hover:scale-[1.04] active:scale-[0.98] shadow-sm"
                          >
                            View
                          </button>

                          {/* EDIT BUTTON */}
                          <button
                            onClick={() => {
                              setSelectedUser(user);
                              setIsEditOpen(true);
                            }}
                            className="h-[36px] px-4 rounded-full bg-[#2D211D] text-white text-[10px] font-bold uppercase tracking-[0.15em] transition-all duration-300 hover:bg-[#7A2E3A] hover:scale-[1.04] active:scale-[0.98] shadow-sm"
                          >
                            Edit
                          </button>

                          {/* DELETE BUTTON (Omission safe block structure) */}
                          {user.role !== "admin" && (
                            <button
                              onClick={() => handleDeleteUser(user._id)}
                              className="h-[36px] px-4 rounded-full border border-red-200 bg-red-50 text-red-700 text-[10px] font-bold uppercase tracking-[0.15em] transition-all duration-300 hover:bg-red-700 hover:text-white hover:border-red-700 hover:scale-[1.04] active:scale-[0.98] shadow-sm"
                            >
                              Delete
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

      </div>

      {/* --- RETAINED PLACEMENTS FOR YOUR CUSTOM CODE OVERLAYS --- */}
      <EditUserModal
        isOpen={isEditOpen}
        user={selectedUser}
        onClose={() => setIsEditOpen(false)}
        onSave={handleSaveUser}
      />

      <UserDetailsModal
        isOpen={detailsOpen}
        user={detailUser}
        orders={userOrders}
        onClose={() => setDetailsOpen(false)}
      />
    </main>
  );
}