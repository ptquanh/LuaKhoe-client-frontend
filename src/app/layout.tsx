import "./globals.css";

import { AntdRegistry } from "@ant-design/nextjs-registry";
import { App as AntdApp, ConfigProvider } from "antd";
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
    <html lang="vi" className={inter.variable} suppressHydrationWarning>
      <body className={`${inter.className} antialiased`}>
        <AntdRegistry>
          <ConfigProvider
            theme={{
              token: {
                colorPrimary: "#16a34a",
                borderRadius: 8,
              },
              // @ts-expect-error: Force disable cssVar to bypass App component warning
              cssVar: false,
            }}
          >
            <AntdApp component={false}>
              <ReactQueryProvider>{children}</ReactQueryProvider>
            </AntdApp>
          </ConfigProvider>
        </AntdRegistry>
      </body>
    </html>
  );
}
