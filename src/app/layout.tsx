import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'AI跨境电商 · 一人公司运营中心',
  description: '全栈式AI自动化跨境电商管理平台 — Dropshipping / Amazon FBA / 社交媒体带货',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="zh-CN">
      <body>{children}</body>
    </html>
  );
}
