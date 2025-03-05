import { SpotTipDto } from "@/application/usecases/spot/dto/SpotTipDto";
import { GetSpotTipUsecase } from "@/application/usecases/spot/GetSpotTipUsecase";
import ReactionRepository from "@/domain/repositories/ReactionRepository";
import SpotRepository from "@/domain/repositories/SpotRepository";
import TipRepository from "@/domain/repositories/TipRepository";
import UserRepository from "@/domain/repositories/UserRepository";
import PgReactionRepository from "@/infrastructure/repositories/PgReactionRepository";
import { PgSpotRepository } from "@/infrastructure/repositories/PgSpotRepository";
import { PgTipRepository } from "@/infrastructure/repositories/PgTipRepository";
import PgUserRepository from "@/infrastructure/repositories/PgUserRepository";
import { NextResponse } from "next/server";

export async function GET(
    request: Request,
    { params }: { params: { spotId: string } }
) {
    const { spotId } = params;
    const tipRepository: TipRepository = new PgTipRepository();
    const userRepository: UserRepository = new PgUserRepository();
    const spotRepository: SpotRepository = new PgSpotRepository();
    const reactionRepository: ReactionRepository = new PgReactionRepository();

    const url = new URL(request.url);
    const sort = url.searchParams.get("sort") || "latest";
    const orderBy = sort === "reaction" ? "reactionCount" : "createdAt";

    const spotTipUsecase = new GetSpotTipUsecase(
        tipRepository,
        userRepository,
        spotRepository,
        reactionRepository
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
