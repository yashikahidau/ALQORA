import { protectedFetch } from "./protectedFetch";

export const createOrder = async (
  products: any[],
  totalAmount: number,
  shippingAddress: {
    fullName: string;
    phone: string;
    address: string;
  },
  paymentMethod: string,
  paymentStatus: string,
  razorpayPaymentId?: string,
  razorpayOrderId?: string
) => {
  return protectedFetch("/orders", {
    method: "POST",
    body: JSON.stringify({
      products,
      totalAmount,
      shippingAddress,
      paymentMethod,
      paymentStatus,
      razorpayPaymentId,
      razorpayOrderId,
    }),
  });
};

export const getMyOrders = async () => {
  return protectedFetch("/orders/my-orders");
};

export const getAllOrders = async () => {
  return protectedFetch("/orders");
};

export const updateOrderStatus = async (
  orderId: string,
  status: string
) => {
  return protectedFetch(`/orders/${orderId}`, {
    method: "PATCH",
    body: JSON.stringify({ status }),
  });
};

export const cancelOrder = async (orderId: string) => {
  try {
    return await protectedFetch(`/orders/cancel/${orderId}`, {
      method: "PUT",
    });
  } catch (error) {
    console.error(error);

    return {
      success: false,
      error: "Failed to cancel order",
    };
  }
};