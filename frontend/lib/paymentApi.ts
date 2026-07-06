import { protectedFetch } from "./protectedFetch";

export const createRazorpayOrder = async (amount: number) => {
  return protectedFetch("/payment/create-order", {
    method: "POST",
    body: JSON.stringify({ amount }),
  });
};

export const verifyRazorpayPayment = async ({
  razorpay_order_id,
  razorpay_payment_id,
  razorpay_signature,
}: {
  razorpay_order_id: string;
  razorpay_payment_id: string;
  razorpay_signature: string;
}) => {
  return protectedFetch("/payment/verify", {
    method: "POST",
    body: JSON.stringify({
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
    }),
  });
};