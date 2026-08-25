import type { Metadata, Viewport } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "RepReady — 873 exercise form guides",
  description: "Browse 873 exercise guides by body part, sub-muscle, equipment and level, with start-and-finish images, muscles worked and clear instructions.",
  applicationName: "RepReady",
  manifest: "/manifest.webmanifest",
  keywords: ["exercise guide", "exercise form", "muscles worked", "gym exercises", "strength training"],
  openGraph: {
    title: "RepReady — One body part. Many ways to train it.",
    description: "873 exercise form guides with sub-muscle filters, start-and-finish images, muscles worked and clear instructions.",
    type: "website",
  },
  twitter: {
    card: "summary",
    title: "RepReady — One body part. Many ways to train it.",
    description: "873 exercise form guides with sub-muscle filters, start-and-finish images, muscles worked and clear instructions.",
  },
};

export const viewport: Viewport = {
  themeColor: "#171916",
  colorScheme: "light",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
