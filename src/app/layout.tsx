//scr/app/layout.tsx
import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Script from "next/script";
import { ThemeProvider } from "@/components/store/ThemeProvider";
import { Providers } from "./providers";


const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Life Ledger",
  description: "Life Ledger",
  icons: {
    icon: "/lifeledger.png",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <meta name="application-name" content="Life Ledger" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
        <meta name="apple-mobile-web-app-title" content="Life Ledger" />
        <meta name="theme-color" content="#4f46e5" />
       
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} `}
      >
        <Providers>
          <ThemeProvider>
            {children}
          </ThemeProvider>
          <Script src="/worker-registration.ts" 
            strategy="afterInteractive" 
            id="service-worker-registration" 
          />
        </Providers>
      </body>
    </html>
  );
}
