import type { Metadata, Viewport } from "next";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL("https://seedbed-gray.vercel.app"),
  title: "seedbed: a flower hover effect for your website",
  description:
    "A dot grid where flowers grow under the cursor and wilt back into dots. Five styles, live controls, and a drop-in web component or React file for your own site. Free and open source.",
  icons: { icon: "/icon.svg" },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#f4f0e6" },
    { media: "(prefers-color-scheme: dark)", color: "#121410" },
  ],
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
        {/* eslint-disable-next-line @next/next/no-page-custom-font */}
        <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Epilogue:wght@400..700&family=JetBrains+Mono:wght@400..500&display=swap" />
      </head>
      <body>{children}</body>
    </html>
  );
}
