import { DfGetSpotsUsecase } from "@/application/usecases/spot/DfGetSpotsUsecase";
import { PgBookmarkRepository } from "@/infrastructure/repositories/PgBookmarkRepository";
import { PgSpotRepository } from "@/infrastructure/repositories/PgSpotRepository";
import { PgTimeRepository } from "@/infrastructure/repositories/PgTimeRepository";
import { PgTipRepository } from "@/infrastructure/repositories/PgTipRepository";
import { NextResponse } from "next/server";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const lat = searchParams.get("lat")
    ? parseFloat(searchParams.get("lat")!)
    : undefined;
  const lng = searchParams.get("lng")
    ? parseFloat(searchParams.get("lng")!)
    : undefined;
  const category = searchParams.get("category") || undefined;
  const maxPrice = searchParams.get("price")
    ? parseInt(searchParams.get("price")!, 10)
    : undefined;

  if (!lat || !lng) {
    return NextResponse.json(
      { error: "위치 정보가 필요합니다." },
      { status: 400 }
    );
  }

  const spotRepo = new PgSpotRepository();
  const bookmarkRepo = new PgBookmarkRepository();
  const tipRepo = new PgTipRepository();
  const timeRepo = new PgTimeRepository();

  const usecase = new DfGetSpotsUsecase(
    spotRepo,
    bookmarkRepo,
    tipRepo,
    timeRepo
  );
  const spots = await usecase.execute(lat, lng, category, maxPrice);

  return NextResponse.json(spots);
}
