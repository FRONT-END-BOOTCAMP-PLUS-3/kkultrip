import { SpotInfoDto } from "@/application/usecases/spot/dto/SpotInfoDto";
import { GetSpotInfoUsecase } from "@/application/usecases/spot/GetSpotInfoUsecase";
import SpotRepository from "@/domain/repositories/SpotRepository";
import { TicketRepository } from "@/domain/repositories/TicketRepository";
import TimeRepository from "@/domain/repositories/TimeRepository";
import PgSpotRepository from "@/infrastructure/repositories/PgSpotRepository";
import { PgTicketRepository } from "@/infrastructure/repositories/PgTicketRepository";
import { PgTimeRepository } from "@/infrastructure/repositories/PgTimeRepository";
import { NextResponse } from "next/server";

export async function GET(
  req: Request,
  props: { params: Promise<{ spotId: string }> }
) {
  const params = await props.params;
  const { spotId } = params;
  const spotRepository: SpotRepository = new PgSpotRepository();
  const ticketRepository: TicketRepository = new PgTicketRepository();
  const timeRepository: TimeRepository = new PgTimeRepository();

  const spotInfoUsecase = new GetSpotInfoUsecase(
    spotRepository,
    ticketRepository,
    timeRepository
  );

  const spotInfo: SpotInfoDto | null = await spotInfoUsecase.execute(
    Number(spotId)
  );

  if (!spotInfo) {
    return NextResponse.json({ error: "Spot not found" }, { status: 404 });
  }

  return NextResponse.json(spotInfo);
}
