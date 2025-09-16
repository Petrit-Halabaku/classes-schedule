import type React from "react";
import type { Metadata } from "next";
import { GeistSans } from "geist/font/sans";
import { GeistMono } from "geist/font/mono";
import { Analytics } from "@vercel/analytics/next";
import { Suspense } from "react";
import { Toaster } from "@/components/ui/toaster";
import { ErrorBoundary } from "@/components/error-boundary";
import { Navigation } from "@/components/navigation";
import { AuthProvider } from "@/components/auth/auth-provider";
import "./globals.css";

export const metadata: Metadata = {
  title: "Class Schedule Management System",
  description: "Academic class scheduling system for universities",
  generator: "v0.app",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`font-sans ${GeistSans.variable} ${GeistMono.variable}`}>
        <ErrorBoundary>
          <AuthProvider>
            <Navigation />
            <Suspense fallback={null}>{children}</Suspense>
            <Toaster />
          </AuthProvider>
        </ErrorBoundary>
        <Analytics />
      </body>
    </html>
  );
}
