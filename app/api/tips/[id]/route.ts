import DeleteTipUsecase from "@/application/usecases/spot/tips/DeleteTipUsecase";
import SpotRepository from "@/domain/repositories/SpotRepository";
import TipRepository from "@/domain/repositories/TipRepository";
import PgSpotRepository from "@/infrastructure/repositories/PgSpotRepository";
import { PgTipRepository } from "@/infrastructure/repositories/PgTipRepository";
import { NextResponse } from "next/server";

export async function DELETE(
    request: Request,
    props: { params: Promise<{ id: string }> }
) {
    const params = await props.params;
    const { id } = params;
    const body = await request.json();
    const { spotId } = body;
    const tipRepository: TipRepository = new PgTipRepository();
    const spotRepository: SpotRepository = new PgSpotRepository();
    const deleteTipUsecase = new DeleteTipUsecase(
        tipRepository,
        spotRepository
    );
    await deleteTipUsecase.execute(Number(id), Number(spotId));

    return NextResponse.json({ message: "Tip deleted" }, { status: 200 });
}
