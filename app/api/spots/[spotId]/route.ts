import { GetSpotHeaderUsecase } from "@/application/usecases/spot/GetSpotHeaderUsecase";
import { SpotHeaderDto } from "@/application/usecases/spot/dto/SpotHeaderDto";
import SpotRepository from "@/domain/repositories/SpotRepository";
import { PgSpotRepository } from "@/infrastructure/repositories/PgSpotRepository";
import { NextResponse } from "next/server";

export async function GET(
    req: Request,
    { params }: { params: { spotId: string } }
) {
    const { spotId } = params;
    const spotRepository: SpotRepository = new PgSpotRepository();
    const spotHeaderUsecase = new GetSpotHeaderUsecase(spotRepository);
    const spotHeader: SpotHeaderDto | null = await spotHeaderUsecase.execute(
        Number(spotId)
    );
    if (!spotHeader) {
        return NextResponse.json({ error: "Spot not found" }, { status: 404 });
    }
    return NextResponse.json(spotHeader);
}
