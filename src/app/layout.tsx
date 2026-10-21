import type { Metadata, Viewport } from "next";
import { AppProvider } from "@/lib/store";
import "./globals.css";

export const metadata: Metadata = {
  title: "AVIA",
  description: "AVIA — semester money planning prototype",
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#fafaf8",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" className="h-full">
      <body className="min-h-full bg-frame">
        <AppProvider>{children}</AppProvider>
      </body>
    </html>
  );
}
