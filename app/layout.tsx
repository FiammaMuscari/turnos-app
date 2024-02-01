import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { SessionProvider } from "next-auth/react";
import { auth } from "@/auth";
import "./globals.css";
import { Toaster } from "@/components/ui/sonner";
import { Navbar } from "./(protected)/_components/navbar";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Inicio de sesión",
  description: "Login",
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();

  return (
    <SessionProvider session={session}>
      <html lang="en">
        <body className="flex flex-col bg-sky-700/65 py-4 px-2">
          <Toaster />
          <Navbar />
          {children}
        </body>
      </html>
    </SessionProvider>
  );
}
