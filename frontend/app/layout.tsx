import GlobalStateProvider from "@/components/state";
import "./globals.css";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { Toaster } from "react-hot-toast";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Interview Wallet",
  description: "Radoslaw Gorecki",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body suppressHydrationWarning className={inter.className}>
        <GlobalStateProvider>
          <Toaster />
          <main className="flex min-h-screen flex-col items-center justify-between">
            <div className="relative flex flex-col items-center justify-center min-h-screen">
              {children}
            </div>
          </main>
        </GlobalStateProvider>
      </body>
    </html>
  );
}
