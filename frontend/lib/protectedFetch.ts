import { API_URL } from "./config";

export const protectedFetch = async (
  endpoint: string,
  options: RequestInit = {}
) => {
  const token =
    typeof window !== "undefined"
      ? localStorage.getItem("token")
      : null;

  const headers = new Headers(options.headers || {});

  if (
    !headers.has("Content-Type") &&
    !(options.body instanceof FormData)
  ) {
    headers.set("Content-Type", "application/json");
  }

  if (token) {
    headers.set("Authorization", `Bearer ${token}`);
  }

  try {
    const response = await fetch(`${API_URL}${endpoint}`, {
      ...options,
      headers,
    });

    const data = await response.json().catch(() => null);

    if (response.status === 401) {
      return {
        success: false,
        unauthorized: true,
        error: data?.error || "Unauthorized",
      };
    }

    if (!response.ok) {
      return {
        success: false,
        error:
          data?.error ||
          data?.message ||
          "Request failed",
      };
    }

    return data;
  } catch (error) {
    console.error("protectedFetch error:", error);

    return {
      success: false,
      error: "Network error. Please try again.",
    };
  }
};