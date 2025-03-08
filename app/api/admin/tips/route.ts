import { NextResponse } from "next/server";
import { GetTipsUseCase } from "@/application/usecases/admin/tip/GetTipsUseCase";
import { PgTipRepository } from "@/infrastructure/repositories/PgTipRepository";
import { GetSpotByIdUseCase } from "@/application/usecases/admin/spot/GetSpotByIdUseCase";
import { PgTicketRepository } from "@/infrastructure/repositories/PgTicketRepository";
import { PgTimeRepository } from "@/infrastructure/repositories/PgTimeRepository";
import PgDocentRepository from "@/infrastructure/repositories/PgDocentRepository";
import PgSpotRepository from "@/infrastructure/repositories/PgSpotRepository";

export async function GET() {
  try {
    const tipRepository = new PgTipRepository();
    const spotRepository = new PgSpotRepository();
    const getTipUseCase = new GetTipsUseCase(tipRepository);
    const ticketRepository = new PgTicketRepository();
    const timeRepository = new PgTimeRepository();
    const docentRepository = new PgDocentRepository();
    const getSpotByIdUseCase = new GetSpotByIdUseCase(
      spotRepository,
      ticketRepository,
      timeRepository,
      docentRepository
    );
    const tips = await getTipUseCase.execute();

    // 각 tip에 대해 spot 이름을 추가
    const tipsWithSpotNames = await Promise.all(
      tips.map(async (tip) => {
        const spot = await getSpotByIdUseCase.execute(tip.spotId);
        return {
          ...tip,
          spotName: spot?.name,
        };
      })
    );

    return NextResponse.json(tipsWithSpotNames, { status: 200 });
  } catch (error) {
    console.error("Error fetching tips:", error);

    return NextResponse.json(
      { error: "Failed to fetch tips" },
      { status: 500 }
    );
  }
}
