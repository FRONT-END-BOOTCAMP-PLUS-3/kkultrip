import { NextResponse } from "next/server";
import { GetSpotDocentUsecase } from "@/application/usecases/spot/GetSpotDocentUsecase";
import PgDocentRepository from "@/infrastructure/repositories/PgDocentRepository";
import DocentRepository from "@/domain/repositories/DocentRepository";
import { SpotDocentDto } from "@/application/usecases/spot/dto/SpotDocentDto";
import SpotRepository from "@/domain/repositories/SpotRepository";
import PgSpotRepository from "@/infrastructure/repositories/PgSpotRepository";

export async function GET(
  req: Request,
  props: { params: Promise<{ spotId: string }> }
) {
  const params = await props.params;
  const { spotId } = params;
  const docentRepository: DocentRepository = new PgDocentRepository();
  const spotRepository: SpotRepository = new PgSpotRepository();
  const docentUsecase = new GetSpotDocentUsecase(
    docentRepository,
    spotRepository
  );

  const docent: SpotDocentDto[] | null = await docentUsecase.execute(
    Number(spotId)
  );

  if (!docent) {
    return NextResponse.json({ error: "Docent not found" }, { status: 404 });
  }
  return NextResponse.json(docent);
}
