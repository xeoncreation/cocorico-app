
import "./globals.css";
import { GlobalErrorHandler } from "./error-handler";
import PageTransition from "@/components/ui/PageTransition";
import Navbar from "@/components/Navbar";
import { ToastProvider } from "../components/ui/ToastProvider";
import { ThemeProvider } from "@/components/ThemeProvider";
import Analytics from "@/components/Analytics";
import type { Viewport } from "next";

export const metadata = {
  title: "Cocorico 🐓 — Cocina inteligente, saludable y divertida",
  description: "Descubre recetas personalizadas con IA, aprende cocina saludable y comparte tus creaciones con el mundo. Tu asistente de cocina con inteligencia artificial.",
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000"),
  keywords: ["cocina", "recetas", "IA", "inteligencia artificial", "saludable", "chef", "cocorico"],
  authors: [{ name: "Cocorico Team" }],
  creator: "Cocorico",
  publisher: "Cocorico",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  icons: {
    icon: "/icons/favicon.ico",
    apple: "/icons/icon-192.png",
  },
  manifest: "/manifest.webmanifest",
  openGraph: {
    title: "Cocorico 🐓 — Tu asistente de cocina inteligente",
    description: "Recetas personalizadas con IA, aprende cocina saludable y comparte tus creaciones.",
    url: process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000",
    siteName: "Cocorico",
    images: [
      { 
        url: "/branding/banner-home.png", 
        width: 1200, 
        height: 630, 
        alt: "Cocorico - Cocina inteligente" 
      }
    ],
    locale: "es_ES",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Cocorico 🐓 — Cocina inteligente",
    description: "Tu asistente de cocina con IA. Recetas personalizadas y cocina saludable.",
    images: ["/branding/banner-home.png"],
    creator: "@cocorico_app",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
};

export const viewport: Viewport = {
  themeColor: "#FBC531",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es" suppressHydrationWarning>
      <body className="min-h-screen font-sans antialiased">
        <ThemeProvider>
          <ToastProvider>
            <GlobalErrorHandler />
            {children}
            <Analytics />
          </ToastProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}

