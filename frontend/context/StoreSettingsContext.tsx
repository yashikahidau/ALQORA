"use client";

import {
  createContext,
  useContext,
  useEffect,
  useState,
} from "react";

import {
  getPublicStoreSettings,
} from "@/lib/adminSettingsApi";

interface StoreSettings {
  reviewsEnabled: boolean;
  wishlistEnabled: boolean;
  codEnabled: boolean;
  guestCheckout: boolean;
  trackingEnabled: boolean;
}

interface StoreSettingsContextType
  extends StoreSettings {
  refreshSettings: () => Promise<void>;
}

const StoreSettingsContext =
  createContext<StoreSettingsContextType | null>(null);

export function StoreSettingsProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [settings, setSettings] =
    useState<StoreSettings>({
      reviewsEnabled: true,
      wishlistEnabled: true,
      codEnabled: true,
      guestCheckout: true,
      trackingEnabled: true,
    });

  const refreshSettings = async () => {
    try {
      const response =
        await getPublicStoreSettings();

      if (response?.success && response.settings) {
        setSettings(response.settings);
      }
    } catch (error) {
      console.error(
        "Failed to refresh store settings:",
        error
      );
    }
  };

  useEffect(() => {
    refreshSettings();

    const handleFocus = () => {
      refreshSettings();
    };

    window.addEventListener("focus", handleFocus);

    return () => {
      window.removeEventListener(
        "focus",
        handleFocus
      );
    };
  }, []);

  return (
    <StoreSettingsContext.Provider
      value={{
        ...settings,
        refreshSettings,
      }}
    >
      {children}
    </StoreSettingsContext.Provider>
  );
}

export const useStoreSettings = () => {
  const context = useContext(
    StoreSettingsContext
  );

  if (!context) {
    throw new Error(
      "useStoreSettings must be used within StoreSettingsProvider"
    );
  }

  return context;
};