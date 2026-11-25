import "./globals.css";

import { AntdRegistry } from "@ant-design/nextjs-registry";
import type { Metadata, Viewport } from "next";
import { Be_Vietnam_Pro, Inter } from "next/font/google";

import { ThemeProvider } from "@/components/theme/ThemeProvider";
import { ReactQueryProvider } from "@/lib/ReactQueryProvider";

const inter = Inter({
  subsets: ["latin", "vietnamese"],
  variable: "--font-inter",
  display: "swap",
});

const beVietnamPro = Be_Vietnam_Pro({
  subsets: ["latin", "vietnamese"],
  weight: ["500", "600", "700", "800"],
  variable: "--font-be-vietnam-pro",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Lúa Khoẻ — Nhận diện bệnh lúa bằng AI",
  description:
    "Chụp ảnh lá lúa, AI sẽ chẩn đoán bệnh và đề xuất phác đồ điều trị ngay lập tức.",
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#ffffff" },
    { media: "(prefers-color-scheme: dark)", color: "#0e1511" },
  ],
};

const themeInitScript = `(function(){try{var t=localStorage.getItem('luakhoe-theme');var d=t==='dark'||(!t&&window.matchMedia('(prefers-color-scheme: dark)').matches);if(d){document.documentElement.classList.add('dark');document.documentElement.style.colorScheme='dark';}else{document.documentElement.classList.remove('dark');document.documentElement.style.colorScheme='light';}}catch(e){}})();`;

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="vi"
      className={`${inter.variable} ${beVietnamPro.variable}`}
      suppressHydrationWarning
    >
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeInitScript }} />
      </head>
      <body
        className={`${inter.className} bg-bg-page text-text-primary antialiased`}
      >
        <AntdRegistry>
          <ThemeProvider>
            <ReactQueryProvider>{children}</ReactQueryProvider>
          </ThemeProvider>
        </AntdRegistry>
      </body>
    </html>
  );
}
