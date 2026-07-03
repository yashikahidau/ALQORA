"use client";

interface Order {
  _id: string;
  totalAmount: number;
  status: string;
  createdAt: string;
}

interface User {
  _id: string;
  name: string;
  email: string;
  role: string;
  badge: string;
  createdAt: string;
}

interface UserDetailsModalProps {
  isOpen: boolean;
  user: User | null;
  orders: Order[];
  onClose: () => void;
}

export default function UserDetailsModal({
  isOpen,
  user,
  orders,
  onClose,
}: UserDetailsModalProps) {

  if (!isOpen || !user) return null;

  const totalSpent =
    orders.reduce(
      (sum, order) =>
        sum + order.totalAmount,
      0
    );

  const averageOrderValue =
    orders.length > 0
      ? totalSpent / orders.length
      : 0;

  return (
    <div className="fixed inset-0 z-[9999] bg-black/40 backdrop-blur-sm flex items-center justify-center p-4">

      <div className="w-full max-w-5xl max-h-[90vh] overflow-y-auto rounded-[40px] bg-[#FDFBF9] border border-[#E4D5CC] shadow-2xl">

        {/* Header */}

        <div className="sticky top-0 bg-[#FDFBF9] border-b border-[#E4D5CC] px-8 py-6 flex items-center justify-between">

          <div>

            <p className="text-[10px] uppercase tracking-[0.35em] text-[#A17F72]">
              Customer Profile
            </p>

            <h2 className="text-5xl font-light text-[#2D211D] font-[family:var(--font-cormorant)]">
              {user.name}
            </h2>

          </div>

          <button
            onClick={onClose}
            className="h-12 w-12 rounded-full border border-[#E4D5CC]"
          >
            ✕
          </button>

        </div>

        {/* Customer Details */}

        <div className="p-8">

          <div className="grid md:grid-cols-4 gap-5">

            <div className="md:col-span-2 rounded-3xl bg-white border border-[#E4D5CC] p-5">

              <p className="text-xs uppercase tracking-[0.2em] text-[#A17F72]">
                Email
              </p>

              <p className="mt-3 text-sm text-[#2D211D] break-all">
                {user.email}
              </p>
            </div>

            <div className="rounded-3xl bg-white border border-[#E4D5CC] p-5">

              <p className="text-xs uppercase tracking-[0.2em] text-[#A17F72]">
                Badge
              </p>

              <p className="mt-3 text-[#2D211D]">
                {user.role === "admin"
                  ? "Administrator"
                  : user.badge}
              </p>

            </div>

            <div className="rounded-3xl bg-white border border-[#E4D5CC] p-5">

              <p className="text-xs uppercase tracking-[0.2em] text-[#A17F72]">
                Role
              </p>

              <p className="mt-3 text-[#2D211D]">
                {user.role}
              </p>

            </div>

            <div className="rounded-3xl bg-white border border-[#E4D5CC] p-5">

              <p className="text-xs uppercase tracking-[0.2em] text-[#A17F72]">
                Joined
              </p>

              <p className="mt-3 text-[#2D211D]">
                {new Date(
                  user.createdAt
                ).toLocaleDateString()}
              </p>

            </div>

          </div>

          {/* Analytics */}

          <div className="grid md:grid-cols-3 gap-5 mt-8">

            <div className="rounded-3xl bg-white border border-[#E4D5CC] p-6">

              <p className="text-xs uppercase tracking-[0.2em] text-[#A17F72]">
                Total Orders
              </p>

              <h3 className="mt-4 text-4xl font-light text-[#2D211D]">
                {orders.length}
              </h3>

            </div>

            <div className="rounded-3xl bg-white border border-[#E4D5CC] p-6">

              <p className="text-xs uppercase tracking-[0.2em] text-[#A17F72]">
                Total Spend
              </p>

              <h3 className="mt-4 text-4xl font-light text-[#2D211D]">
                ₹{totalSpent.toLocaleString()}
              </h3>

            </div>

            <div className="rounded-3xl bg-white border border-[#E4D5CC] p-6">

              <p className="text-xs uppercase tracking-[0.2em] text-[#A17F72]">
                Avg Order
              </p>

              <h3 className="mt-4 text-4xl font-light text-[#2D211D]">
                ₹
                {Math.round(
                  averageOrderValue
                ).toLocaleString()}
              </h3>

            </div>

          </div>

          {/* Orders */}

          <div className="mt-10">

            <h3 className="text-3xl font-light text-[#2D211D] mb-6 font-[family:var(--font-cormorant)]">
              Order History
            </h3>

            <div className="overflow-hidden rounded-3xl border border-[#E4D5CC] bg-white">

              <table className="w-full">

                <thead>

                  <tr className="bg-[#F3ECE7]">

                    <th className="p-4 text-left">
                      Order ID
                    </th>

                    <th className="p-4 text-left">
                      Amount
                    </th>

                    <th className="p-4 text-left">
                      Status
                    </th>

                    <th className="p-4 text-left">
                      Date
                    </th>

                  </tr>

                </thead>

                <tbody>

                  {orders.map(
                    (order) => (

                      <tr
                        key={order._id}
                        className="border-t"
                      >

                        <td className="p-4">
                          #{order._id.slice(-6)}
                        </td>

                        <td className="p-4">
                          ₹
                          {order.totalAmount}
                        </td>

                        <td className="p-4">
                          {order.status}
                        </td>

                        <td className="p-4">
                          {new Date(
                            order.createdAt
                          ).toLocaleDateString()}
                        </td>

                      </tr>

                    ))}

                </tbody>

              </table>

            </div>

          </div>

        </div>

      </div>

    </div>
  );
}