import GetImageBySpotIdUsecase from "@/application/usecases/spot/images/GetImageBySpotIdUsecase";
import { ImageRepository } from "@/domain/repositories/ImageRepository";
import TipRepository from "@/domain/repositories/TipRepository";
import { PgImageRepository } from "@/infrastructure/repositories/PgImageRepository";
import { PgTipRepository } from "@/infrastructure/repositories/PgTipRepository";
import { NextRequest, NextResponse } from "next/server";

export async function GET(
    request: NextRequest,
    { params }: { params: Promise<{ spotId: string }> }
) {
    const { spotId } = await params;
    const pgTipRepository: TipRepository = new PgTipRepository();
    const pgImageRepository: ImageRepository = new PgImageRepository();
    const usecase = new GetImageBySpotIdUsecase(
        pgTipRepository,
        pgImageRepository
    );

    const images = await usecase.execute(Number(spotId), "createdAt");
    return NextResponse.json(images);
}
