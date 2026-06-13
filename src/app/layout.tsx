import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: {
    default: "VistaSphere — 360° Virtual Tour Platform",
    template: "%s | VistaSphere",
  },
  description:
    "Upload a 360° GLB model and instantly generate an immersive virtual tour with QR sharing. No login required.",
  keywords: [
    "virtual tour",
    "360 tour",
    "GLB viewer",
    "immersive experience",
    "QR code tour",
    "3D tour",
    "virtual reality",
    "property tour",
  ],
  openGraph: {
    type: "website",
    siteName: "VistaSphere",
    title: "VistaSphere — 360° Virtual Tour Platform",
    description:
      "Upload a 360° GLB model and instantly generate an immersive virtual tour with QR sharing.",
  },
  twitter: {
    card: "summary_large_image",
    title: "VistaSphere — 360° Virtual Tour Platform",
    description:
      "Upload a 360° GLB model and instantly generate an immersive virtual tour with QR sharing.",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800;900&display=swap" rel="stylesheet" />
      </head>
      <body>
        <div className="noise" aria-hidden="true" />
        {children}
      </body>
    </html>
  );
}
