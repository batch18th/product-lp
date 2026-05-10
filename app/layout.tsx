import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "FaithWear Nepal | Christian Bible Verse T-Shirts",
  description:
    "Order premium Christian Bible Verse Print T-Shirts in Nepal with Cash on Delivery.",
  icons: {
    icon: [
      { url: "/favicon.ico", sizes: "32x32" },
      { url: "/icon.png", type: "image/png", sizes: "32x32" },
      { url: "/favicon-faithwear.png", type: "image/png", sizes: "512x512" },
    ],
    apple: [{ url: "/apple-touch-icon.png", sizes: "180x180" }],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
