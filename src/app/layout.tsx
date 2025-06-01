import type { Metadata } from "next";
import ClientLayout from "./client-layout";
import "./globals.css"; // ✅ ADD THIS LINE - This loads Tailwind CSS

export const metadata: Metadata = {
  title: "LearningTube - Transform YouTube Playlists into Interactive Courses",
  description:
    "Convert YouTube educational content into structured learning. Track progress, take notes, and learn at your pace.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <link
        rel="apple-touch-icon"
        sizes="180x180"
        href="/apple-touch-icon.png"
      />
      <link
        rel="icon"
        type="image/png"
        sizes="32x32"
        href="/favicon-32x32.png"
      />
      <link
        rel="icon"
        type="image/png"
        sizes="16x16"
        href="/favicon-16x16.png"
      />
      <link rel="manifest" href="/site.webmanifest" />
      <body>
        <ClientLayout>{children}</ClientLayout>
      </body>
    </html>
  );
}
