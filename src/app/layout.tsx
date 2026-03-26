import "./globals.css";

import { AntdRegistry } from "@ant-design/nextjs-registry";
import type { Metadata } from "next";

import { ReactQueryProvider } from "@/lib/ReactQueryProvider";

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
    <html lang="vi">
      <body>
        <AntdRegistry>
          <ReactQueryProvider>{children}</ReactQueryProvider>
        </AntdRegistry>
      </body>
    </html>
  );
}
