import { GetImageListUseCase } from "@/application/usecases/image/GetImageListUseCase";
import { PgImageRepository } from "@/infrastructure/repositories/PgImageRepository";
import { NextResponse } from "next/server";

export async function GET() {
  const imageRepository = new PgImageRepository();
  const getImageListUseCase = new GetImageListUseCase(imageRepository);

  const imageList = await getImageListUseCase.execute();
  return NextResponse.json(imageList);
}
