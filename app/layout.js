import "./globals.css";
import LayoutWrapper from "@/components/LayoutWrapper";
import { CartProvider } from "@/components/CartContext";
import { AuthProvider } from "@/context/AuthContext";
import { WishlistProvider } from "@/context/WishlistContext";

export const metadata = {
  title: "Krishna Textiles | Everything You Need in Textiles",
  description:
    "Shop quality textiles from Erode, Tiruppur and leading textile markets. Trusted brands, wholesale & retail, pan-India delivery.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className="min-h-screen flex flex-col font-sans bg-[#f8fafc] text-slate-800 antialiased">
        <AuthProvider>
          <WishlistProvider>
            <CartProvider>
              <LayoutWrapper>{children}</LayoutWrapper>
            </CartProvider>
          </WishlistProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
