import { NextResponse } from "next/server";
import { GetTipListUseCase } from "@/application/usecases/admin/tip/GetTipListUseCase";
import { PgTipRepository } from "@/infrastructure/repositories/PgTipRepository";
import PgSpotRepository from "@/infrastructure/repositories/PgSpotRepository";

export async function GET() {
  try {
    const tipRepository = new PgTipRepository();
    const spotRepository = new PgSpotRepository();
    const getTipUseCase = new GetTipListUseCase(tipRepository, spotRepository);

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
