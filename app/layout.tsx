import "@/styles/globals.css";
import { Metadata, Viewport } from "next";
import { Link } from "@nextui-org/link";
import clsx from "clsx";

import { Providers } from "./providers";

import { siteConfig } from "@/config/site";
import { fontSans, fontHeading } from "@/config/fonts";
import { Navbar } from "@/components/navbar";
import CustomCursor from "@/components/ui/CustomCursor";

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

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html suppressHydrationWarning lang="en">
      <head />
      <body
        className={clsx(
          "min-h-screen bg-background font-sans antialiased",
          fontSans.variable,
          fontHeading.variable
        )}
      >
        <Providers themeProps={{ attribute: "class", defaultTheme: "dark" }}>
          <CustomCursor />
          <div className="relative flex flex-col h-screen">
            <Navbar />
            <main className="container mx-auto max-w-7xl pt-16 px-6 flex-grow">
              {children}
            </main>
            <footer className="w-full flex items-center justify-center py-3">

            </footer>
          </div>
        </Providers>
      </body>
    </html>
  );
}
