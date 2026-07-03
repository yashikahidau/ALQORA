import type { Metadata } from "next";
import { Cormorant_Garamond, Inter } from "next/font/google";
import "./globals.css";
import { CartProvider } from "@/context/CartContext";
import { AuthProvider } from "@/context/AuthContext";
import { WishlistProvider } from "@/context/WishlistContext";
import AppLayout from "@/components/layout/AppLayout";
import { GoogleOAuthProvider } from "@react-oauth/google";
import Script from "next/script";
import { StoreSettingsProvider } from "@/context/StoreSettingsContext";
import { Toaster } from "sonner";

const cormorant = Cormorant_Garamond({
  subsets: ["latin"],
  variable: "--font-cormorant",
  weight: ["300", "400", "500", "600", "700"],
});

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

export const metadata: Metadata = {
  title: "ALQORA",
  description: "Luxury Beauty Editorial",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${cormorant.variable} ${inter.variable}`}
    >
      <body className="bg-[#F8F1EB] text-[#2D211D] antialiased">
        <Script
          src="https://checkout.razorpay.com/v1/checkout.js"
          strategy="afterInteractive"
        />
        <GoogleOAuthProvider
          clientId={
            process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID!
          }
        >
          <StoreSettingsProvider>
            <AuthProvider>
              <WishlistProvider>
                <CartProvider>

                  <AppLayout>
                    {children}
                  </AppLayout>

                </CartProvider>
              </WishlistProvider>
            </AuthProvider>
          </StoreSettingsProvider>

        </GoogleOAuthProvider>


        <Toaster
          position="top-right"
          richColors
          closeButton
        />
      </body>
    </html>
  );
}