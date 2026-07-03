import { protectedFetch } from "./protectedFetch";

export const createRazorpayOrder = async (
  amount: number
) => {
  return protectedFetch("/payment/create-order", {
    method: "POST",
    body: JSON.stringify({
      amount,
    }),
  });
};