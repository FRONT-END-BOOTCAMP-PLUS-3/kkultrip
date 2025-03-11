import { NextRequest, NextResponse } from "next/server";
import { GetUserTipsUsecase } from "@/application/usecases/users/GetUserTipsUsecase";
import { PgTipRepository } from "@/infrastructure/repositories/PgTipRepository";
import { PgUserRepository } from "@/infrastructure/repositories/PgUserRepository";
import PgReactionRepository from "@/infrastructure/repositories/PgReactionRepository";
import TipRepository from "@/domain/repositories/TipRepository";
import UserRepository from "@/domain/repositories/UserRepository";
import ReactionRepository from "@/domain/repositories/ReactionRepository";
import SpotRepository from "@/domain/repositories/SpotRepository";
import PgSpotRepository from "@/infrastructure/repositories/PgSpotRepository";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const nickname = searchParams.get("nickname");
    const sort = (searchParams.get("sort") || "latest") as "latest" | "popular"; // 기본 정렬은 최신순

    if (!nickname) {
      return NextResponse.json(
        { message: "닉네임을 입력하세요." },
        { status: 400 }
      );
    }

    const userRepository: UserRepository = new PgUserRepository();
    const tipRepository: TipRepository = new PgTipRepository();
    const reactionRepository: ReactionRepository = new PgReactionRepository();
    const spotRepository: SpotRepository = new PgSpotRepository();

    const usecase = new GetUserTipsUsecase(
      userRepository,
      tipRepository,
      reactionRepository,
      spotRepository
    );

    const tips = await usecase.execute(nickname, sort);

    return NextResponse.json({ tips }, { status: 200 });
  } catch (error) {
    console.log("❌ 닉네임으로 꿀팁 조회 오류:", error);
    return NextResponse.json({ message: "서버 오류 발생" }, { status: 500 });
  }
}
