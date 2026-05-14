import "./globals.css";

import { AntdRegistry } from "@ant-design/nextjs-registry";
import type { Metadata } from "next";
import { Inter } from "next/font/google";

import { ReactQueryProvider } from "@/lib/ReactQueryProvider";

const inter = Inter({
  subsets: ["latin", "vietnamese"],
  variable: "--font-inter",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Lúa Khoẻ — Nhận diện bệnh lúa bằng AI",
  description:
    "Chụp ảnh lá lúa, AI sẽ chẩn đoán bệnh và đề xuất phác đồ điều trị ngay lập tức.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="vi" className={inter.variable}>
      <body className={`${inter.className} antialiased`}>
        <AntdRegistry>
          <ReactQueryProvider>{children}</ReactQueryProvider>
        </AntdRegistry>
      </body>
    </html>
  );
}
