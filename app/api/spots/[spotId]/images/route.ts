import GetImageBySpotIdUsecase from "@/application/usecases/spot/images/GetImageBySpotIdUsecase";
import { ImageRepository } from "@/domain/repositories/ImageRepository";
import TipRepository from "@/domain/repositories/TipRepository";
import { PgImageRepository } from "@/infrastructure/repositories/PgImageRepository";
import { PgTipRepository } from "@/infrastructure/repositories/PgTipRepository";
import { NextRequest, NextResponse } from "next/server";

export async function GET(
<<<<<<< HEAD
    request: NextRequest,
    props: { params: Promise<{ spotId: string }> }
) {
    const params = await props.params;
    const { spotId } = params;
    const pgTipRepository: TipRepository = new PgTipRepository();
    const pgImageRepository: ImageRepository = new PgImageRepository();
    const usecase = new GetImageBySpotIdUsecase(
        pgTipRepository,
        pgImageRepository
    );

    const images = await usecase.execute(Number(spotId), "createdAt");
    return NextResponse.json(images);
}
=======
  req: NextRequest,
  props: { params: Promise<{ tipId: string }> }
) {
  try {
    const params = await props.params;
    const tipId = params.tipId;

    if (!tipId) {
      return NextResponse.json(
        { error: "Tip ID is required" },
        { status: 400 }
      );
    }

    const tipRepo = new PgTipRepository();
    const imageRepo = new PgImageRepository();
    const getTipWithImagesUsecase = new GetTipUsecase(tipRepo, imageRepo);

    const userId = "d9b78231-1d27-479c-9a28-903bd67433e6";
    const tip = await getTipWithImagesUsecase.execute(Number(tipId));

    if (!tip) {
      return NextResponse.json(
        { error: "해당 팁을 찾을 수 없습니다." },
        { status: 404 }
      );
    }

    if (tip.userId !== userId) {
      return NextResponse.json(
        { error: "본인이 작성한 팁만 수정할 수 있습니다." },
        { status: 403 }
      );
    }

    return NextResponse.json(tip, { status: 200 });
  } catch (error) {
    console.error("❌ 팁 불러오기에 실패했습니다 :", error);
    return NextResponse.json({ error: "서버 오류 발생" }, { status: 500 });
  }
}

export async function PUT(
  req: NextRequest,
  props: { params: Promise<{ tipId: string }> }
) {
  try {
    const params = await props.params;
    const { tipId } = params;

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
    const existingImagePaths = formData.getAll("existingImages") as string[];

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
    console.error("❌ 팁 업데이트 오류:", error);
    return NextResponse.json({ error: "서버 오류 발생" }, { status: 500 });
  }
}
>>>>>>> 8235c63d0d3ed0c440fe4b44bfa914ed0043b28a
