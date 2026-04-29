import type { Metadata } from "next";
import { Cormorant_Garamond, Manrope, Space_Grotesk } from "next/font/google";
import "./globals.css";
import { Toaster } from "react-hot-toast";
import Providers from "./providers";

const cormorant = Cormorant_Garamond({
  subsets: ["latin"],
  variable: "--font-cormorant",
  weight: ["300", "400", "500", "600", "700"],
});

const manrope = Manrope({
  subsets: ["latin"],
  variable: "--font-manrope",
  weight: ["200", "300", "400", "500", "600", "700", "800"],
});

const spaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
  variable: "--font-space-grotesk",
  weight: ["300", "400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: "PageDrop — Instant AI Landing Pages for Small Businesses",
  description:
    "Create a beautiful website for your WhatsApp-based business in seconds. AI writes your copy. Free to start.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${cormorant.variable} ${manrope.variable} ${spaceGrotesk.variable} font-manrope antialiased`}
      >
        <Providers>
          {children}
          <Toaster
            position="top-right"
            toastOptions={{
              style: {
                borderRadius: "12px",
                background: "#1A1A26",
                color: "#F0F0FF",
                fontSize: "14px",
                border: "1px solid rgba(255,255,255,0.08)",
              },
            }}
          />
        </Providers>
      </body>
    </html>
  );
}
