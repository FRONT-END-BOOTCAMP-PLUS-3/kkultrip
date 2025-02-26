import { GetSpotDetailUsecase } from "@/application/usecases/spot/GetSpotDetailUsecase";
import { PgSpotRepository } from "@/infrastructure/repositories/PgSpotRepository";
import PgTicketRepository from "@/infrastructure/repositories/PgTicketRepository";
import { NextResponse } from "next/server";

export async function GET(
    req: Request,
    { params }: { params: { spotId: string } }
) {
    const { spotId } = params;
    const spotRepository = new PgSpotRepository();
    const ticketRepository = new PgTicketRepository();
    const spotDetailUsecase = new GetSpotDetailUsecase(
        spotRepository,
        ticketRepository
    );
    const spotDetail = await spotDetailUsecase.execute(Number(spotId));

    if (!spotDetail) {
        return NextResponse.json({ error: "Spot not found" }, { status: 404 });
    }

    return NextResponse.json(spotDetail);
}
