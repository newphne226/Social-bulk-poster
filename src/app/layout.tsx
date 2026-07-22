import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/sonner";
import { ThemeProvider } from "@/components/theme-provider";
import { LiveChat } from "@/components/live-chat";
import SaleNotification from "@/components/sale-notification";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "SMTools — Multi-Platform Social Media Scheduling SaaS",
  description:
    "Schedule, publish, and analyze posts across Facebook, Instagram, X, LinkedIn, and Pinterest. AI-powered captions, multi-account management, and a Chrome extension for on-the-go posting.",
  keywords: [
    "social media scheduler",
    "social media management",
    "Chrome extension",
    "multi-platform posting",
    "AI captions",
    "content scheduling",
  ],
  authors: [{ name: "SMTools Team" }],
  openGraph: {
    title: "SMTools — Multi-Platform Social Media Scheduling",
    description: "Schedule, publish, and analyze posts across all your social accounts from one place.",
    siteName: "SMTools",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "SMTools — Multi-Platform Social Media Scheduling",
    description: "Schedule, publish, and analyze posts across all your social accounts.",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-background text-foreground`}
      >
        <ThemeProvider
          attribute="class"
          defaultTheme="light"
          enableSystem
          disableTransitionOnChange
        >
          {children}
          <SaleNotification />
          <LiveChat />
          <Toaster richColors position="top-right" />
        </ThemeProvider>
      </body>
    </html>
  );
}
