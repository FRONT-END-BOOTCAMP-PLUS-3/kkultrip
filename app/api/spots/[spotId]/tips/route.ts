import { SpotTipDto } from "@/application/usecases/spot/tips/dto/SpotTipDto";
import { GetSpotTipUsecase } from "@/application/usecases/spot/tips/GetSpotTipUsecase";
import ImageRepository from "@/domain/repositories/ImageRepository";
import ReactionRepository from "@/domain/repositories/ReactionRepository";
import SpotRepository from "@/domain/repositories/SpotRepository";
import TipRepository from "@/domain/repositories/TipRepository";
import UserRepository from "@/domain/repositories/UserRepository";
import PgImageRepository from "@/infrastructure/repositories/PgImageRepository";
import PgReactionRepository from "@/infrastructure/repositories/PgReactionRepository";
import { PgSpotRepository } from "@/infrastructure/repositories/PgSpotRepository";
import { PgTipRepository } from "@/infrastructure/repositories/PgTipRepository";
import PgUserRepository from "@/infrastructure/repositories/PgUserRepository";
import { NextResponse } from "next/server";

export async function GET(
    request: Request,
    props: { params: Promise<{ spotId: string }> }
) {
    const params = await props.params;
    const { spotId } = params;
    const tipRepository: TipRepository = new PgTipRepository();
    const userRepository: UserRepository = new PgUserRepository();
    const spotRepository: SpotRepository = new PgSpotRepository();
    const reactionRepository: ReactionRepository = new PgReactionRepository();
    const imageRepository: ImageRepository = new PgImageRepository();

    const url = new URL(request.url);
    const sort = url.searchParams.get("sort") || "latest";
    const orderBy = sort === "reaction" ? "reactionCount" : "createdAt";

    const spotTipUsecase = new GetSpotTipUsecase(
        tipRepository,
        userRepository,
        spotRepository,
        reactionRepository,
        imageRepository
    );
    const spotTipList: SpotTipDto[] = await spotTipUsecase.execute(
        Number(spotId),
        orderBy
    );

    if (!spotTipList) {
        return NextResponse.json({ error: "Spot not found" }, { status: 404 });
    }

    return NextResponse.json(spotTipList);
}

