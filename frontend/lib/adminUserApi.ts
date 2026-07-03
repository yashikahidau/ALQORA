import { protectedFetch }
from "./protectedFetch";

export const getAllUsers =
async () => {

  try {

    return await protectedFetch(
      "/admin/users"
    );

  } catch {

    return {
      success: false,
      error:
        "Failed to load users",
    };
  }
};

export const updateUserRole =
async (
  userId: string,
  role: string
) => {

  return protectedFetch(
    `/admin/users/${userId}/role`,
    {
      method: "PATCH",

      body: JSON.stringify({
        role,
      }),
    }
  );
};

export const updateUserBadge =
async (
  userId: string,
  badge: string
) => {

  return protectedFetch(
    `/admin/users/${userId}/badge`,
    {
      method: "PATCH",

      body: JSON.stringify({
        badge,
      }),
    }
  );
};

export const getUserDetails =
async (
  userId: string
) => {

  return protectedFetch(
    `/admin/users/${userId}`
  );
};


export const deleteUser =
async (
  userId: string
) => {

  return protectedFetch(
    `/admin/users/${userId}`,
    {
      method: "DELETE",
    }
  );
};

export const exportCustomers =
async () => {

  return protectedFetch(
    "/admin/users/export"
  );
};

export const exportOrders =
async () => {

  return protectedFetch(
    "/admin/orders/export"
  );
};

export const exportRevenue =
async () => {

  return protectedFetch(
    "/admin/revenue/export"
  );
};