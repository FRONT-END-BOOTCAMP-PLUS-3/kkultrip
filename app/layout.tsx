import "./globals.css";

export const metadata = {
  title: "kkultrip",
  description: "관광 명소 도슨트 서비스",
};
export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko">
      <head>
        <meta charSet="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>꿀트립</title>
        <link rel="icon" href="/favicon.ico" />
        <meta
          name="description"
          content="관광명소에 대한 정보를 제공하는 도슨트 서비스"
        />
        <meta name="keywords" content="관광, 도슨트, 명소, 꿀팁, 리뷰" />
        <meta name="author" content="꿀트립 팀" />
        {/* Open Graph 메타 태그 (페이스북, 카카오, 디스코드 등) */}
        <meta property="og:title" content="꿀트립 - 명소 도슨트 서비스" />
        <meta
          property="og:description"
          content="쉽고 간편한 명소 소개 서비스! 지금 함께 사용해보세요."
        />
        <meta
          property="og:image"
          content="https://kkultrip.vercel.app/og-image.png"
        />
        <meta property="og:url" content="https://kkultrip.vercel.app/" />
        <meta property="og:type" content="website" />
      </head>
      <body>
        <div className="container">{children}</div>
      </body>
    </html>
  );
}
