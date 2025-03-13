import { NextResponse } from "next/server";
import { GetImageBySpotNameUseCase } from "@/application/usecases/admin/image/GetImageBySpotNameUseCase";
import { PgImageRepository } from "@/infrastructure/repositories/PgImageRepository";
import PgSpotRepository from "@/infrastructure/repositories/PgSpotRepository";
import { PgTipRepository } from "@/infrastructure/repositories/PgTipRepository";
import { PgUserRepository } from "@/infrastructure/repositories/PgUserRepository";

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
    const spotRepository = new PgSpotRepository();
    const tipRepository = new PgTipRepository();
    const imageRepository = new PgImageRepository();
    const userRepository = new PgUserRepository();

    const getImageBySpotNameUseCase = new GetImageBySpotNameUseCase(
      spotRepository,
      tipRepository,
      imageRepository,
      userRepository
    );

    const images = await getImageBySpotNameUseCase.execute(spotName);

    if (!images) {
      return NextResponse.json(
        { error: "No images found for this spot" },
        { status: 404 }
      );
    }

    return NextResponse.json({ images }, { status: 200 });
  } catch (error) {
    console.log(error);
    return NextResponse.json(
      { error: "Something went wrong" },
      { status: 500 }
    );
  }
}
