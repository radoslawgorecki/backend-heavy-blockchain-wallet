import GlobalStateProvider from "@/components/state";
import "./globals.css";
import type { Metadata } from "next";
import { Inter } from "next/font/google";

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
      <body className={inter.className}>
        <GlobalStateProvider>
          <main className="flex min-h-screen flex-col items-center justify-between">
            <div className="relative flex flex-col items-center justify-center h-screen overflow-hidden">
              {children}
            </div>
          </main>
        </GlobalStateProvider>
      </body>
    </html>
  );
}
