import { NextRequest, NextResponse } from "next/server";
import { PgTipRepository } from "@/infrastructure/repositories/PgTipRepository";
import { PgImageRepository } from "@/infrastructure/repositories/PgImageRepository";
import { UpdateTipUsecase } from "@/application/usecases/spot/tip/UpdateTipUsecase";
import { GetTipUsecase } from "@/application/usecases/spot/tip/GetTipUsecase";

export async function GET(
  req: NextRequest,
  { params }: { params: { tipId: string } }
) {
  try {
    const tipRepo = new PgTipRepository();
    const imageRepo = new PgImageRepository();
    const getTipWithImagesUsecase = new GetTipUsecase(tipRepo, imageRepo);

    // // 요청 헤더에서 userId 가져오기
    // const userId = req.headers.get("userId");
    // if (!userId) {
    //   return NextResponse.json(
    //     { error: "유저 정보가 없습니다." },
    //     { status: 401 }
    //   );
    // }

    const userId = "7379a017-90cb-40da-9635-eb7eff4d8e83";

    const tip = await getTipWithImagesUsecase.execute(Number(params.tipId));

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

    return NextResponse.json({ tip }, { status: 200 });
  } catch (error) {
    console.log("❌ 팁 불러오기에 실패했습니다 :", error);
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

    const updatedTip = await updateTipUsecase.execute({
      tipId: parseInt(params.tipId),
      description,
      price: parseInt(price),
      waitingTime: parseInt(waitingTime),
      images: imageFiles,
    });

    return NextResponse.json(updatedTip);
  } catch (error) {
    console.log("❌ 팁 업데이트 오류:", error);
    return NextResponse.json({ error: "서버 오류 발생" }, { status: 500 });
  }
};
