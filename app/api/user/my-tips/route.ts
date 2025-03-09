import { GetMyTipsUsecase } from "@/application/usecases/user/GetMyTipsUsecase";
import { ImageRepository } from "@/domain/repositories/ImageRepository";
import ReactionRepository from "@/domain/repositories/ReactionRepository";
import SpotRepository from "@/domain/repositories/SpotRepository";
import TipRepository from "@/domain/repositories/TipRepository";
import { PgImageRepository } from "@/infrastructure/repositories/PgImageRepository";
import PgReactionRepository from "@/infrastructure/repositories/PgReactionRepository";
import PgSpotRepository from "@/infrastructure/repositories/PgSpotRepository";
import { PgTipRepository } from "@/infrastructure/repositories/PgTipRepository";
import { GetUserInfoByJWT } from "@/utils/jwt";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  try {
    const token = req.cookies.get("token")?.value;
    if (!token) {
      return NextResponse.json(
        { message: "Unauthorized: No token provided" },
        { status: 401 }
      );
    }

    const jwtData = await GetUserInfoByJWT(token);
    if (!jwtData) {
      return NextResponse.json(
        { message: "Unauthorized: Invalid token" },
        { status: 401 }
      );
    }

    const tipRepository: TipRepository = new PgTipRepository();
    const reactionRepository: ReactionRepository = new PgReactionRepository();
    const imageRepository: ImageRepository = new PgImageRepository();
    const spotRepository: SpotRepository = new PgSpotRepository();

    const userMyTipUseCase = new GetMyTipsUsecase(
      tipRepository,
      reactionRepository,
      imageRepository,
      spotRepository
    );
    const userMyTipList = await userMyTipUseCase.execute(
      jwtData.userId as string
    );

    if (!userMyTipList) {
      return NextResponse.json(
        { error: "UserTips not found" },
        { status: 404 }
      );
    }
    return NextResponse.json({ userMyTipList }, { status: 200 });
  } catch (error) {
    if (error instanceof Error) {
      return NextResponse.json({ message: error.message }, { status: 500 });
    }
    return NextResponse.json(
      { message: "UserTips not found" },
      { status: 404 }
    );
  }
}
