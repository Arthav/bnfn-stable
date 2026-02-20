import "@/styles/globals.css";
import { Metadata, Viewport } from "next";
import clsx from "clsx";
import { Providers } from "./providers";
import { siteConfig } from "@/config/site";
import { fontSans, fontHeading } from "@/config/fonts";

export const metadata: Metadata = {
  title: {
    default: siteConfig.name,
    template: `%s - ${siteConfig.name}`,
  },
  authors: [
    {
      name: "Christian Bonafena",
      url: "https://github.com/Arthav",
    },
  ],
  generator: "Personal website of Christian Bonafena, next ui, vercel ",
  keywords: [
    "Personal website",
    "next ui",
    "vercel",
    "Christian Bonafena",
  ],
  creator: "Christian Bonafena",
  applicationName: siteConfig.name,
  description: siteConfig.description,
  icons: {
    icon: "/star.ico",
  },
};

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "white" },
    { media: "(prefers-color-scheme: dark)", color: "black" },
  ],
};

import { PageTransitionProvider } from "@/components/page-transition-provider";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html suppressHydrationWarning lang="en">
      <head />
      <body
        suppressHydrationWarning
        className={clsx(
          "min-h-screen bg-background font-sans antialiased",
          fontSans.variable,
          fontHeading.variable
        )}
      >
        <Providers themeProps={{ attribute: "class", defaultTheme: "dark" }}>
          <PageTransitionProvider>
            {children}
          </PageTransitionProvider>
        </Providers>
      </body>
    </html>
  );
}
