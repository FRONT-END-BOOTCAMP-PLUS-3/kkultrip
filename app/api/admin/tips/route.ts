import { NextResponse } from "next/server";
import { GetTipsUseCase } from "@/application/usecases/admin/tip/GetTipsUseCase";
import { PgTipRepository } from "@/infrastructure/repositories/PgTipRepository";

export async function GET() {
  try {
    const tipRepository = new PgTipRepository();
    const getTipUseCase = new GetTipsUseCase(tipRepository);
    const tips = await getTipUseCase.execute();

    return NextResponse.json(tips, { status: 200 });
  } catch (error) {
    console.error("Error fetching tips:", error);

    return NextResponse.json(
      { error: "Failed to fetch tips" },
      { status: 500 }
    );
  }
}
