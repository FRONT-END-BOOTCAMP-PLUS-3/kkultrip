import { GetSpotDetailUsecase } from "@/application/usecases/spot/GetSpotDetailUsecase";
import { PgSpotRepository } from "@/infrastructure/repositories/PgSpotRepository";
import { NextResponse } from "next/server";

export async function GET(req: Request, props: { params: Promise<{ spotId: string }> }) {
    const params = await props.params;
    const { spotId } = params;
    const spotRepository = new PgSpotRepository();
    const spotDetailUsecase = new GetSpotDetailUsecase(spotRepository);
    const spotDetail = await spotDetailUsecase.execute(Number(spotId));

    if (!spotDetail) {
        return NextResponse.json({ error: "Spot not found" }, { status: 404 });
    }

    return NextResponse.json(spotDetail);
}
