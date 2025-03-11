import { GetImageListUseCase } from "@/application/usecases/admin/image/GetImageListUseCase";
import { PgImageRepository } from "@/infrastructure/repositories/PgImageRepository";
import { PgTipRepository } from "@/infrastructure/repositories/PgTipRepository";
import PgSpotRepository from "@/infrastructure/repositories/PgSpotRepository";
import { PgUserRepository } from "@/infrastructure/repositories/PgUserRepository";
import { NextResponse } from "next/server";

export async function GET() {
  const imageRepository = new PgImageRepository();
  const tipRepository = new PgTipRepository();
  const spotRepository = new PgSpotRepository();
  const userRepository = new PgUserRepository();

  const getImageListUseCase = new GetImageListUseCase(
    imageRepository,
    tipRepository,
    spotRepository,
    userRepository
  );

  const imageList = await getImageListUseCase.execute();

  return NextResponse.json(imageList);
}
