import { NextRequest, NextResponse } from "next/server";
import GetReactionUsecase from "@/application/usecases/spot/tips/GetReactionUsecase";
import DeleteTipUsecase from "@/application/usecases/spot/tips/DeleteTipUsecase";
import { PgTipRepository } from "@/infrastructure/repositories/PgTipRepository";
import { PgImageRepository } from "@/infrastructure/repositories/PgImageRepository";
import PgSpotRepository from "@/infrastructure/repositories/PgSpotRepository";
import PgReactionRepository from "@/infrastructure/repositories/PgReactionRepository";
import { GetTipWithSpotUsecase } from "@/application/usecases/admin/tip/GetTipWithSpotUseCase";

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
    const spotRepo = new PgSpotRepository();
    const reactionRepo = new PgReactionRepository();

    const getTipWithSpotUsecase = new GetTipWithSpotUsecase(
      tipRepo,
      imageRepo,
      spotRepo
    );
    const getReactionUsecase = new GetReactionUsecase(reactionRepo);

    const tip = await getTipWithSpotUsecase.execute(Number(tipId));
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

    return NextResponse.json({ tip, reaction }, { status: 200 });
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
