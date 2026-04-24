import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Scream Challenge",
  description: "How loud can you scream?",
};  

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="font-courier antialiased">
        <div className="min-h-screen flex flex-col">{children}</div>
      </body>
    </html>
  );
}
