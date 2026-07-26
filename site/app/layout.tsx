import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "手护智感 AI 智能体",
  description:
    "基于 Wi-Fi CSI 与多源事件融合的非视觉化手卫生行为感知与提醒系统",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="zh-CN">
      <body>{children}</body>
    </html>
  );
}
