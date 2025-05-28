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
      <body>
        <ClientLayout>{children}</ClientLayout>
      </body>
    </html>
  );
}
