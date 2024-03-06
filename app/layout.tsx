import { Toaster } from "@/components/ui/sonner";
import { Analytics } from "@vercel/analytics/react";
import { GeistMono } from "geist/font/mono";
import { GeistSans } from "geist/font/sans";
import type { Metadata } from "next";
import "./globals.css";

import { Header } from "@/components/header";
import { Providers } from "@/components/providers";
import { AI } from "./action";

const meta = {
  title: "snowBrain - AI RSC Demo",
  description: "snowBrain - AI Driven snowflake data insights",
};
export const metadata: Metadata = {
  metadataBase: new URL("https://snowbrain.dev"),
  ...meta,
  title: {
    default: "snowBrain - AI",
    template: `%s - AI`,
  },
  icons: {
    icon: "/favicon.ico",
  },
  twitter: {
    ...meta,
    card: "summary_large_image",
    site: "@kaarthikcodes",
    images: "./opengraph-image.png",
  },
  openGraph: {
    ...meta,
    images: "./opengraph-image.png",
    locale: "en-US",
    type: "website",
  },
};

export const viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "white" },
    { media: "(prefers-color-scheme: dark)", color: "black" },
  ],
};

export const runtime = "edge";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`font-sans antialiased ${GeistSans.variable} ${GeistMono.variable}`}
      >
        <Toaster />
        <AI>
          <Providers
            attribute="class"
            defaultTheme="system"
            enableSystem
            disableTransitionOnChange
          >
            <div className="flex flex-col min-h-screen">
              <Header />
              <main className="flex flex-col flex-1 bg-muted/50 dark:bg-background">
                {children}
              </main>
            </div>
          </Providers>
        </AI>
        <Analytics />
      </body>
    </html>
  );
}
