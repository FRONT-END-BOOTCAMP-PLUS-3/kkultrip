import { NextResponse } from "next/server";
import { GetImageByUserNameUseCase } from "@/application/usecases/admin/image/GetImageByUserNameUseCase";
import { PgUserRepository } from "@/infrastructure/repositories/PgUserRepository";
import { PgTipRepository } from "@/infrastructure/repositories/PgTipRepository";
import { PgImageRepository } from "@/infrastructure/repositories/PgImageRepository";
import PgSpotRepository from "@/infrastructure/repositories/PgSpotRepository";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const userName = searchParams.get("userName");

  if (!userName) {
    return NextResponse.json(
      { error: "User name is required" },
      { status: 400 }
    );
  }

  try {
    const userRepository = new PgUserRepository();
    const tipRepository = new PgTipRepository();
    const imageRepository = new PgImageRepository();
    const spotRepository = new PgSpotRepository();

    const getImageByUserNameUseCase = new GetImageByUserNameUseCase(
      userRepository,
      tipRepository,
      imageRepository,
      spotRepository
    );

    const images = await getImageByUserNameUseCase.execute(userName);

    if (!images) {
      return NextResponse.json(
        { error: "No images found for this user" },
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
