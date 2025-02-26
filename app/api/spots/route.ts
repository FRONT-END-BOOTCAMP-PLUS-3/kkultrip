import { GetSpotsDTO } from "@/application/usecases/spot/dto/GetSpotsDto";
import { GetSpotByNameUsecase } from "@/application/usecases/spot/GetSpotByNameUsecase";
import { GetSpotsUsecase } from "@/application/usecases/spot/GetSpotsUsecase";
import { PgBookmarkRepository } from "@/infrastructure/repositories/PgBookmarkRepository";
import { PgSpotRepository } from "@/infrastructure/repositories/PgSpotRepository";
import { PgTimeRepository } from "@/infrastructure/repositories/PgTimeRepository";
import { PgTipRepository } from "@/infrastructure/repositories/PgTipRepository";
import { NextResponse } from "next/server";

export const GET = async (req: Request) => {
  const { searchParams } = new URL(req.url);

  const query = searchParams.get("query")?.trim() || undefined;
  const lat = searchParams.get("lat")
    ? parseFloat(searchParams.get("lat")!)
    : undefined;
  const lon = searchParams.get("lon")
    ? parseFloat(searchParams.get("lon")!)
    : undefined;
  const category = searchParams.get("category") || undefined;
  const maxPrice = searchParams.get("price")
    ? parseInt(searchParams.get("price")!, 10)
    : undefined;

  const spotRepo = new PgSpotRepository();
  const bookmarkRepo = new PgBookmarkRepository();
  const tipRepo = new PgTipRepository();
  const timeRepo = new PgTimeRepository();

  const getSpotsUsecase = new GetSpotsUsecase(
    spotRepo,
    bookmarkRepo,
    tipRepo,
    timeRepo
  );
  const getSpotByNameUsecase = new GetSpotByNameUsecase(
    spotRepo,
    bookmarkRepo,
    tipRepo,
    timeRepo
  );

  try {
    if (query) {
      // ✅ 특정 명소 검색
      const spotByName: GetSpotsDTO[] = await getSpotByNameUsecase.execute(
        query
      );
      if (spotByName.length > 0) {
        console.log("📌 특정 명소 검색 결과:", spotByName);
        return NextResponse.json({
          spots: spotByName,
          lat: spotByName[0].lat, // ✅ 특정 명소의 lat 추가
          lon: spotByName[0].lon, // ✅ 특정 명소의 lon 추가
        });
      }

      // ✅ 특정 명소가 아니라면 지역 이름 검색
      const apiBaseUrl =
        process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:3000";
      const geoResponse = await fetch(
        `${apiBaseUrl}/api/geocode?query=${query}`
      );
      const geoData = await geoResponse.json();

      if (geoData.lat && geoData.lon) {
        const locationBasedSpots: GetSpotsDTO[] = await getSpotsUsecase.execute(
          geoData.lat,
          geoData.lon,
          category,
          maxPrice
        );
        console.log("📌 지역 검색 결과:", locationBasedSpots);
        return NextResponse.json({
          spots: locationBasedSpots,
          lat: geoData.lat, // ✅ 검색된 지역의 lat 추가
          lon: geoData.lon, // ✅ 검색된 지역의 lon 추가
        });
      }

      return NextResponse.json({ spots: [], lat: undefined, lon: undefined });
    }

    // ✅ 위치 기반 검색 (`lat, lon`만 있는 경우)
    if (lat !== undefined && lon !== undefined) {
      const spots = await getSpotsUsecase.execute(lat, lon, category, maxPrice);
      console.log("📌 위치 기반 검색 결과:", spots);
      return NextResponse.json({ spots, lat, lon });
    }

    return NextResponse.json({ spots: [], lat: undefined, lon: undefined });
  } catch (error) {
    console.error("❌ API 오류 발생:", error);
    return NextResponse.json({ error: "서버 오류 발생" }, { status: 500 });
  }
};
