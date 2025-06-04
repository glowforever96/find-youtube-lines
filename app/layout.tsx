import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "유튜브 영상 대사 찾기",
  description: "유튜브 영상에서 검색하고 싶은 대사를 찾아주는 서비스입니다.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <section className="w-full h-[100dvh] max-w-[800px] bg-white">
          {children}
        </section>
      </body>
    </html>
  );
}
