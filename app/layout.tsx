import { ClientRootLayout } from "@/components/client-root-layout";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { NuqsAdapter } from 'nuqs/adapters/next/app'
import { Toaster } from 'sonner';
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: {
    default: "ByteMusic | Home",
    template: "%s | ByteMusic"
  },
  description: "A modern music streaming platform",
  applicationName: "ByteMusic",
  keywords: ["music", "streaming", "audio", "songs", "playlists"],
  authors: [{ name: "NovqiGarrix" }],
  creator: "NovqiGarrix",
  publisher: "NovqiGarrix",
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className="dark">
      <body className={inter.className}>
        <NuqsAdapter>
          <Toaster />
          <ClientRootLayout>
            {children}
          </ClientRootLayout>
        </NuqsAdapter>
      </body>
    </html>
  )
}