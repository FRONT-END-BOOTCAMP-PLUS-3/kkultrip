import { NextResponse } from "next/server";
import { PgTipRepository } from "@/infrastructure/repositories/PgTipRepository";
import { PgImageRepository } from "@/infrastructure/repositories/PgImageRepository";
import { UpdateTipUsecase } from "@/application/usecases/spot/tip/UpdateTipUsecase";
import { GetTipUsecase } from "@/application/usecases/spot/tip/GetTipUsecase";

export async function GET(
  req: Request,
  { params }: { params: { tipId: string } }
) {
  try {
    const tipRepo = new PgTipRepository();
    const imageRepo = new PgImageRepository();
    const getTipWithImagesUsecase = new GetTipUsecase(tipRepo, imageRepo);

    const tip = await getTipWithImagesUsecase.execute(Number(params.tipId));

    if (!tip) {
      return NextResponse.json(
        { error: "해당 팁을 찾을 수 없습니다." },
        { status: 404 }
      );
    }

    return NextResponse.json({ tip }, { status: 200 });
  } catch (error) {
    console.error("Error fetching tip details:", error);
    return NextResponse.json({ error: "서버 오류 발생" }, { status: 500 });
  }
}

export const PUT = async (
  req: Request,
  { params }: { params: { tipId: string } }
) => {
  try {
    const { description, price, waitingTime } = await req.json();
    const formData = await req.formData();
    const imageFiles = formData.getAll("images") as File[];

    const tipRepo = new PgTipRepository();
    const imageRepo = new PgImageRepository();
    const updateTipUsecase = new UpdateTipUsecase(tipRepo, imageRepo);

    const updatedTip = await updateTipUsecase.execute(
      parseInt(params.tipId),
      description,
      parseInt(price),
      parseInt(waitingTime),
      imageFiles
    );

    return NextResponse.json(updatedTip);
  } catch (error) {
    console.log("❌ 팁 업데이트 오류:", error);
    return NextResponse.json({ error: "서버 오류 발생" }, { status: 500 });
  }
};
