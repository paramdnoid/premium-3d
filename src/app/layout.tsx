import type { Metadata, Viewport } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "ZIAN AI CONCEPTS | Andre Zimmermann",
  description:
    "Premium-KI-Konzepte, individuelle Software und kontrollierte Automatisierung von Andre Zimmermann.",
};

export const viewport: Viewport = {
  themeColor: "#040607",
  colorScheme: "dark",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="h-full">
      <body suppressHydrationWarning>{children}</body>
    </html>
  );
}
