import type { Metadata } from "next";
import { Cairo, Geist, Geist_Mono, Newsreader } from "next/font/google";
import { BRAND } from "@/lib/brand";
import { getLocale, localeDir } from "@/lib/locale";
import { getTheme } from "@/lib/theme";
import { SurpriseCatcher } from "@/components/surprise-catcher";
import { SpeedInsights } from "@vercel/speed-insights/next";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const newsreader = Newsreader({
  variable: "--font-newsreader",
  subsets: ["latin"],
});

const cairo = Cairo({
  variable: "--font-cairo",
  subsets: ["arabic"],
  weight: ["400", "600", "700", "800"],
});

export const metadata: Metadata = {
  metadataBase: new URL(BRAND.siteUrl),
  title: `${BRAND.nameAr} — ${BRAND.subjectAr}`,
  description: `${BRAND.teacherAr} · ${BRAND.titleAr} · ${BRAND.subjectAr} · ${BRAND.gradeAr}`,
  alternates: {
    canonical: "/",
  },
};

export default async function RootLayout({ children }: LayoutProps<"/">) {
  const locale = await getLocale();
  const theme = await getTheme();

  return (
    <html
      lang={locale}
      dir={localeDir(locale)}
      suppressHydrationWarning
      className={`${geistSans.variable} ${geistMono.variable} ${newsreader.variable} ${cairo.variable} h-full antialiased ${locale === "en" ? "en" : ""} ${theme === "dark" ? "dark" : ""}`}
    >
      <body
        suppressHydrationWarning
        className={`flex min-h-full flex-col ${locale === "en" ? geistSans.className : cairo.className}`}
      >
        {children}
        <SurpriseCatcher locale={locale} />
        <SpeedInsights />
      </body>
    </html>
  );
}
