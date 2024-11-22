import type { Metadata } from "next";
import {Poppins} from "next/font/google"
import localFont from "next/font/local";
import "./globals.css";

const poppins = Poppins({
  weight: '500',
  subsets: ['latin'],
});

export const metadata: Metadata = {
  title: "Create Next App",
  description: "Generated by create next app",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
    <body
        className={`${poppins.className} bg-stone-100`}>
    {children}
    </body>
    </html>
  );
}
