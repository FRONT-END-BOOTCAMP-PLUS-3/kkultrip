import { NextResponse } from "next/server";

export const GET = async (req: Request) => {
  const { searchParams } = new URL(req.url);
  const query = searchParams.get("query");

  if (!query) {
    return NextResponse.json(
      { error: "검색어가 필요합니다." },
      { status: 400 }
    );
  }

  try {
    const response = await fetch(
      `https://naveropenapi.apigw.ntruss.com/map-geocode/v2/geocode?query=${encodeURIComponent(
        query
      )}`,
      {
        headers: {
          "X-NCP-APIGW-API-KEY-ID":
            process.env.NEXT_PUBLIC_NAVER_MAP_CLIENT_ID!,
          "X-NCP-APIGW-API-KEY": process.env.NAVER_MAP_CLIENT_SECRET!,
        },
      }
    );

    if (!response.ok) {
      console.error(
        `❌ 네이버 Geocode API 오류: ${response.status} ${response.statusText}`
      );
      return NextResponse.json(
        { error: "네이버 API 인증 오류 발생" },
        { status: response.status }
      );
    }

    const data = await response.json();

    if (data.addresses && data.addresses.length > 0) {
      const { x, y } = data.addresses[0];
      return NextResponse.json({ lat: parseFloat(y), lon: parseFloat(x) });
    } else {
      return NextResponse.json(
        { error: "위치를 찾을 수 없습니다." },
        { status: 404 }
      );
    }
  } catch (error) {
    console.error("❌ 서버 내부 오류:", error);
    return NextResponse.json({ error: "서버 오류 발생" }, { status: 500 });
  }
};
