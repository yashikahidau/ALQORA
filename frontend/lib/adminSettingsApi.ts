import { API_URL } from "./config";
import { protectedFetch } from "./protectedFetch";

export const getStoreSettings = async () => {
  return protectedFetch("/admin/settings");
};

export const updateStoreSettings = async (
  settings: any
) => {
  return protectedFetch("/admin/settings", {
    method: "PUT",
    body: JSON.stringify(settings),
  });
};

export const getPublicStoreSettings = async () => {
  const response = await fetch(
    `${API_URL}/admin/settings/public`
  );

  return response.json();
};