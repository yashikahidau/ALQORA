"use client";

import { usePathname } from "next/navigation";
import { Navbar } from "@/components/ui/Navbar";

export default function AppLayout({
  children,
}: {
  children: React.ReactNode;
}) {

  const pathname = usePathname();

  const hideNavbar = 
  pathname.startsWith("/login") || 
  pathname.startsWith("/register");
  
  return (
    <>
      {!hideNavbar && <Navbar />}
      {children}
    </>
  );
}