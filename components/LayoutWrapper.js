"use client";

import { usePathname } from "next/navigation";
import TopBar from "./TopBar";
import Header from "./Header";
import Footer from "./Footer";
import CartOffcanvas from "./CartOffcanvas";

export default function LayoutWrapper({ children }) {
  const pathname = usePathname();
  const isAuthPage =
    pathname === "/signin" ||
    pathname === "/signup" ||
    pathname === "/login" ||
    pathname === "/register";

  return (
    <>
      {!isAuthPage && <TopBar />}
      {!isAuthPage && <Header />}
      <main className="flex-1">{children}</main>
      {!isAuthPage && <Footer />}
      {!isAuthPage && <CartOffcanvas />}
    </>
  );
}
