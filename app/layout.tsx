import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/theme-provider";
import { ThemeToggle } from "@/components/theme-toggle";
import { Logo } from "@/components/logo";

const geist = Geist({
  variable: "--font-geist",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "FitCal — TDEE Calculator",
  description: "Calculate your Total Daily Energy Expenditure",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geist.variable} ${geistMono.variable} h-full antialiased`}
      suppressHydrationWarning
    >
      <body className="min-h-full flex flex-col">
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
          <header className="w-full">
            <div className="max-w-4xl mx-auto px-4 pt-3 flex items-center justify-between">
              <Logo className="h-6 w-auto text-foreground" />
              <ThemeToggle />
            </div>
          </header>
          {children}
          <footer className="w-full mt-auto py-6 md:fixed md:bottom-0 md:left-0 md:right-0 md:py-3 md:bg-background/80 md:backdrop-blur-sm md:border-t md:border-border/40">
            <div className="max-w-4xl mx-auto px-4 flex justify-center">
              <a
                href="https://railway.com?referralCode=zlqyw6"
                target="_blank"
                rel="noopener noreferrer"
                className="text-xs text-muted-foreground hover:text-foreground transition-colors"
              >
                Hosted on Railway
              </a>
            </div>
          </footer>
        </ThemeProvider>
      </body>
    </html>
  );
}
