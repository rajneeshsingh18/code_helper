import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/providers";
import { Navbar } from "@/components/layout/navbar";
import { SessionProvider } from "@/components/providers/session-provider";

const inter = Inter({ subsets: ["latin"] });

const baseUrl = process.env.NEXTAUTH_URL || "http://localhost:3000";

export const metadata: Metadata = {
  metadataBase: new URL(baseUrl),
  title: {
    default: "CodePrep - Master Coding Interviews",
    template: "%s | CodePrep",
  },
  description: "The ultimate platform to practice coding problems, track algorithmic progress, and ace your technical interviews.",
  keywords: ["coding interviews", "leetcode", "neetcode", "algorithm", "data structures", "software engineering"],
  authors: [{ name: "CodePrep Team" }],
  creator: "CodePrep",
  openGraph: {
    type: "website",
    locale: "en_US",
    url: baseUrl,
    siteName: "CodePrep",
    title: "CodePrep - Master Coding Interviews",
    description: "Practice coding problems and track your algorithmic growth with live telemetry.",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "CodePrep Platform",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "CodePrep - Master Coding Interviews",
    description: "The next generation of coding interview prep.",
    images: ["/og-image.png"],
  },
  robots: {
    index: true,
    follow: true,
  },
  alternates: {
    canonical: baseUrl,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${inter.className} min-h-screen bg-background`}>
        <SessionProvider>
          <ThemeProvider attribute="class" defaultTheme="dark" enableSystem>
            <div className="relative flex min-h-screen flex-col">
              <Navbar />
              <main className="flex-1">{children}</main>
            </div>
          </ThemeProvider>
        </SessionProvider>
      </body>
    </html>
  );
}