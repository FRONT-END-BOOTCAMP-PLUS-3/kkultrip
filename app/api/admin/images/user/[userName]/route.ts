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
    // Repository 인스턴스 생성
    const userRepository = new PgUserRepository();
    const tipRepository = new PgTipRepository();
    const imageRepository = new PgImageRepository();
    const spotRepository = new PgSpotRepository();

    // UseCase 인스턴스 생성
    const getImageByUserNameUseCase = new GetImageByUserNameUseCase(
      userRepository,
      tipRepository,
      imageRepository,
      spotRepository
    );

    // 유저 이름으로 이미지 가져오기
    const images = await getImageByUserNameUseCase.execute(userName);

    if (!images) {
      return NextResponse.json(
        { error: "No images found for this user" },
        { status: 404 }
      );
    }

    // 유저 이름에 해당하는 이미지들 반환
    return NextResponse.json({ images }, { status: 200 });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Something went wrong" },
      { status: 500 }
    );
  }
}
