import { cn } from "@/lib/utils";
import { GeistSans } from 'geist/font/sans';
import type { Metadata, Viewport } from "next";
import Script from "next/script";
import "./globals.css";
import Providers from "./Providers";

export const metadata: Metadata = {
  title: "Background image remover",
  description: "portrait background removal site using Webgpu",
  creator: "Mouktar Aden",
};
export const viewport: Viewport = {
  width: 'device-width',
  minimumScale: 1,
  initialScale: 1,
  userScalable: false
};


export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <Script defer src="https://umami.mouktar.com/script.js" data-website-id="06e8d374-eccd-441d-8efa-9c8bc1ae95a6" />
      </head>
      <body className={cn(
        "min-h-dvh bg-background antialiased",
        GeistSans.className
      )}>
        <Providers>
          {children}
        </Providers>
      </body>
    </html>
  )
}
