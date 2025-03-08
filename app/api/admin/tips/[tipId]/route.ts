import { NextRequest, NextResponse } from "next/server";
import { PgTipRepository } from "@/infrastructure/repositories/PgTipRepository";
import { PgImageRepository } from "@/infrastructure/repositories/PgImageRepository";
import { GetTipUsecase } from "@/application/usecases/spot/tip/GetTipUsecase";
import PgSpotRepository from "@/infrastructure/repositories/PgSpotRepository";
import DeleteTipUsecase from "@/application/usecases/spot/tips/DeleteTipUsecase";
import GetReactionUsecase from "@/application/usecases/spot/tips/GetReactionUsecase";
import PgReactionRepository from "@/infrastructure/repositories/PgReactionRepository";

export async function GET(req: NextRequest) {
  try {
    const pathname = req.nextUrl.pathname;
    const tipId = pathname.split("/").pop();

    if (!tipId) {
      return NextResponse.json(
        { error: "Tip ID is required" },
        { status: 400 }
      );
    }

    const tipRepo = new PgTipRepository();
    const imageRepo = new PgImageRepository();
    const reactionRepo = new PgReactionRepository();
    const getTipUsecase = new GetTipUsecase(tipRepo, imageRepo);
    const getReactionUsecase = new GetReactionUsecase(reactionRepo);

    const tip = await getTipUsecase.execute(Number(tipId));
    if (!tip) {
      return NextResponse.json(
        { error: "해당 팁을 찾을 수 없습니다." },
        { status: 404 }
      );
    }

    const reaction = await getReactionUsecase.execute(
      Number(tipId),
      tip.userId
    );

    if (!tip) {
      return NextResponse.json(
        { error: "해당 팁을 찾을 수 없습니다." },
        { status: 404 }
      );
    }

    return NextResponse.json(
      { tip, reaction }, // tip과 reaction을 동시에 반환
      { status: 200 }
    );
  } catch (error) {
    console.error("❌ GET 요청 처리 중 오류 발생:", error);
    return NextResponse.json(
      { error: "서버 오류가 발생했습니다." },
      { status: 500 }
    );
  }
}

export async function DELETE(request: Request) {
  try {
    const { tipId, spotId } = await request.json();
    const tipRepository = new PgTipRepository();
    const spotRepository = new PgSpotRepository();
    const deleteTipUsecase = new DeleteTipUsecase(
      tipRepository,
      spotRepository
    );

    await deleteTipUsecase.execute(tipId, spotId);

    return NextResponse.json(
      { message: "Tip deleted successfully" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error deleting tip:", error);

    return NextResponse.json(
      { error: "Failed to delete tip" },
      { status: 500 }
    );
  }
}
