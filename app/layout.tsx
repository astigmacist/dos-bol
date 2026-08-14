import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL(
    process.env.VERCEL_PROJECT_PRODUCTION_URL
      ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`
      : "http://localhost:3000",
  ),
  title: "Qorgau AI — безопасная школа начинается с доверия",
  description:
    "Цифровое пространство для профилактики буллинга, поддержки учеников и создания безопасной школьной среды.",
  openGraph: {
    title: "Qorgau AI",
    description: "Каждый ученик достоин чувствовать себя в безопасности",
    images: [{ url: "/og.png", width: 1200, height: 630 }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Qorgau AI",
    description: "Каждый ученик достоин чувствовать себя в безопасности",
    images: ["/og.png"],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ru" suppressHydrationWarning>
      <body>{children}</body>
    </html>
  );
}
