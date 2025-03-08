import { NextRequest, NextResponse } from "next/server";
import { PgTipRepository } from "@/infrastructure/repositories/PgTipRepository";
import { PgImageRepository } from "@/infrastructure/repositories/PgImageRepository";
import { GetTipUsecase } from "@/application/usecases/spot/tip/GetTipUsecase";

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
    const getTipUsecase = new GetTipUsecase(tipRepo, imageRepo);

    const tip = await getTipUsecase.execute(Number(tipId));

    if (!tip) {
      return NextResponse.json(
        { error: "해당 팁을 찾을 수 없습니다." },
        { status: 404 }
      );
    }

    return NextResponse.json(tip, { status: 200 });
  } catch (error) {
    console.error("❌ GET 요청 처리 중 오류 발생:", error);
    return NextResponse.json(
      { error: "서버 오류가 발생했습니다." },
      { status: 500 }
    );
  }
}