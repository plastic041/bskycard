import type { Metadata } from "next";
import "./globals.css";
import { Analytics } from "@vercel/analytics/react";

export const metadata: Metadata = {
  title: "Bluesky Profile TCG Card",
  description: "Your Bluesky Profile Card",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko">
      <body className="antialiased h-svh flex flex-col container mx-auto">
        {children}

        <footer className="ml-auto mb-8">
          <a
            href="https://bsky.app/profile/did:plc:fyuc652ac2vizpmpm7uofw74"
            className="hover:underline p-4"
            target="_blank"
            rel="noreferrer"
          >
            by <span className="text-blue-500">@snubi.bsky.social</span>
          </a>
        </footer>
        <Analytics />
      </body>
    </html>
  );
}
