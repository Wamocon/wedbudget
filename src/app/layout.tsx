import type { Metadata } from "next";
import type { ReactNode } from "react";
import { Inter, Outfit } from "next/font/google";
import Script from "next/script";
import "./globals.css";
import "./print.css";
import { LanguageProvider } from "@/context/language-context";
import { ThemeProvider } from "@/context/theme-context";

const inter = Inter({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600"],
  variable: "--font-body",
  display: "swap",
});

const outfit = Outfit({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  variable: "--font-heading",
  display: "swap",
});

export const metadata: Metadata = {
  title: "WedBudget – Kostenfreier Hochzeitsplaner",
  description:
    "Plane dein Hochzeitsbudget kostenlos, werbefrei und ohne Datenspeicherung auf unseren Servern.",
  applicationName: "WedBudget",
  icons: {
    icon: "/app-icon-light.svg",
    shortcut: "/app-icon-light.svg",
    apple: "/app-icon-light.svg",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: ReactNode;
}>) {
  return (
    <html lang="de" className={`${inter.variable} ${outfit.variable}`} suppressHydrationWarning>
      <head>
        <Script id="theme-init" strategy="beforeInteractive">
          {`try{var _t=localStorage.getItem('wedbudget_theme');document.documentElement.setAttribute('data-theme',_t==='light'?'light':_t==='dark'?'dark':'light')}catch(e){}`}
        </Script>
      </head>
      <body>
        <ThemeProvider>
          <LanguageProvider>{children}</LanguageProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
