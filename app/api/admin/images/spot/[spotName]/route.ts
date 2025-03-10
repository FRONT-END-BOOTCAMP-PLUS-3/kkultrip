import { NextResponse } from "next/server";
import GetImageBySpotIdUsecase from "@/application/usecases/spot/images/GetImageBySpotIdUsecase";
import { GetSpotByNameUsecase } from "@/application/usecases/spot/GetSpotByNameUsecase";
import { PgImageRepository } from "@/infrastructure/repositories/PgImageRepository";
import { PgBookmarkRepository } from "@/infrastructure/repositories/PgBookmarkRepository";
import PgSpotRepository from "@/infrastructure/repositories/PgSpotRepository";
import { PgTipRepository } from "@/infrastructure/repositories/PgTipRepository";
import { PgTimeRepository } from "@/infrastructure/repositories/PgTimeRepository";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const spotName = searchParams.get("spotName");

  if (!spotName) {
    return NextResponse.json(
      { error: "Spot name is required" },
      { status: 400 }
    );
  }

  try {
    // GetSpotByNameUsecase 실행
    const spotRepository = new PgSpotRepository();
    const bookmarkRepository = new PgBookmarkRepository();
    const tipRepository = new PgTipRepository();
    const timeRepository = new PgTimeRepository();

    const getSpotByNameUsecase = new GetSpotByNameUsecase(
      spotRepository,
      bookmarkRepository,
      tipRepository,
      timeRepository
    );

    const spotData = await getSpotByNameUsecase.execute(spotName);

    if (spotData.length === 0) {
      return NextResponse.json({ error: "Spot not found" }, { status: 404 });
    }

    const spot = spotData[0]; // GetSpotByNameUsecase로부터 얻은 첫 번째 spot 데이터

    // GetImageBySpotIdUsecase 실행
    const imageRepository = new PgImageRepository();
    const getImageBySpotIdUsecase = new GetImageBySpotIdUsecase(
      tipRepository,
      imageRepository
    );

    const images = await getImageBySpotIdUsecase.execute(spot.id, "createdAt");

    return NextResponse.json({ images }, { status: 200 });
  } catch (error) {
    console.log(error);
    return NextResponse.json(
      { error: "Something went wrong" },
      { status: 500 }
    );
  }
}
