import { GetTipUsecase } from "@/application/usecases/spot/tip/GetTipUsecase";
import { UpdateTipUsecase } from "@/application/usecases/spot/tip/UpdateTipUsecase";
import DeleteTipUsecase from "@/application/usecases/spot/tips/DeleteTipUsecase";
import { ImageRepository } from "@/domain/repositories/ImageRepository";
import SpotRepository from "@/domain/repositories/SpotRepository";
import TipRepository from "@/domain/repositories/TipRepository";
import { PgImageRepository } from "@/infrastructure/repositories/PgImageRepository";
import PgSpotRepository from "@/infrastructure/repositories/PgSpotRepository";
import { PgTipRepository } from "@/infrastructure/repositories/PgTipRepository";
import { GetUserInfoByJWT } from "@/utils/jwt";
import { NextRequest, NextResponse } from "next/server";

export async function GET(
  req: NextRequest,
  props: { params: Promise<{ id: string }> }
) {
  try {
    const params = await props.params;
    const tipId = params.id;
    const tipRepo = new PgTipRepository();
    const imageRepo = new PgImageRepository();
    const getTipWithImagesUsecase = new GetTipUsecase(tipRepo, imageRepo);

    if (!tipId) {
      return NextResponse.json(
        { error: "Tip ID is required" },
        { status: 400 }
      );
    }
    const token = req.cookies.get("token")?.value;
    if (!token) {
      return NextResponse.json(
        { message: "토큰정보가 없습니다. 로그인이 필요합니다." },
        { status: 401 }
      );
    }

    const jwtData = await GetUserInfoByJWT(token);
    if (!jwtData) {
      return NextResponse.json(
        { message: "토큰정보가 없습니다. 로그인이 필요합니다." },
        { status: 401 }
      );
    }
    const userId = jwtData.userId as string;

    // const userId = "d9b78231-1d27-479c-9a28-903bd67433e6";

    const tip = await getTipWithImagesUsecase.execute(Number(tipId));

    if (!tip) {
      return NextResponse.json(
        { error: "해당 팁을 찾을 수 없습니다." },
        { status: 404 }
      );
    }

    // 요청한 유저가 작성자가 아니면 에러 반환
    if (tip.userId !== userId) {
      return NextResponse.json(
        { error: "본인이 작성한 팁만 수정할 수 있습니다." },
        { status: 403 }
      );
    }

    return NextResponse.json(tip, { status: 200 });
  } catch (error) {
    console.log("❌ 팁 불러오기에 실패했습니다 :", error);
    return NextResponse.json({ error: "서버 오류 발생" }, { status: 500 });
  }
}

export const PUT = async (
  req: NextRequest,
  props: { params: Promise<{ id: string }> }
) => {
  try {
    const params = await props.params;
    const tipId = params.id;

    if (!tipId) {
      return NextResponse.json(
        { error: "Tip ID is required" },
        { status: 400 }
      );
    }
    const formData = await req.formData();
    const description = formData.get("description") as string;
    const price = Number(formData.get("price"));
    const waitingTime = Number(formData.get("waitingTime"));
    const newImageFiles = formData.getAll("images") as File[];
    const existingImagePaths = formData.getAll("existingImages") as string[]; // 기존 이미지 목록

    const tipRepo = new PgTipRepository();
    const imageRepo = new PgImageRepository();
    const spotRepo = new PgSpotRepository();
    const updateTipUsecase = new UpdateTipUsecase(tipRepo, imageRepo, spotRepo);

    await updateTipUsecase.execute({
      tipId: parseInt(tipId),
      description,
      price,
      waitingTime,
      newImageFiles,
      existingImagePaths,
    });

    return NextResponse.json({ status: 201 });
  } catch (error) {
    console.log("❌ 팁 업데이트 오류:", error);
    return NextResponse.json({ error: "서버 오류 발생" }, { status: 500 });
  }
};

export async function DELETE(
  request: Request,
  props: { params: Promise<{ id: string }> }
) {
  const params = await props.params;
  const { id } = params;
  const body = await request.json();
  const { spotId } = body;
  const tipRepository: TipRepository = new PgTipRepository();
  const spotRepository: SpotRepository = new PgSpotRepository();
  const imageRepository: ImageRepository = new PgImageRepository();
  const deleteTipUsecase = new DeleteTipUsecase(
    tipRepository,
    spotRepository,
    imageRepository
  );
  await deleteTipUsecase.execute(Number(id), Number(spotId));

  return NextResponse.json({ message: "Tip deleted" }, { status: 200 });
}
