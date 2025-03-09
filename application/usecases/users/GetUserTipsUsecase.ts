import UserRepository from "@/domain/repositories/UserRepository";
import TipRepository from "@/domain/repositories/TipRepository";
import ReactionRepository from "@/domain/repositories/ReactionRepository";
import SpotRepository from "@/domain/repositories/SpotRepository";
import { GetUserTipDto } from "./dto/GetUserTipDto";

type TipWithSpotInfo = {
  id: number;
  createdAt: Date;
  reactionCount: number;
  spotImg: string;
  category: string;
  spotName: string;
  spotId: number;
};

export class GetUserTipsUsecase {
  constructor(
    private userRepository: UserRepository,
    private tipRepository: TipRepository,
    private reactionRepository: ReactionRepository,
    private spotRepository: SpotRepository
  ) {}

  async execute(
    nickname: string,
    sort: "latest" | "popular"
  ): Promise<GetUserTipDto[]> {
    const user = await this.userRepository.getUserIdByNickname(nickname);
    if (!user) {
      throw new Error("해당 닉네임의 유저가 없습니다.");
    }
    const userId = user.id;

    let tips = await this.tipRepository.getTipsByUserId(userId);

    const enrichedTips: TipWithSpotInfo[] = await Promise.all(
      tips.map(async (tip) => {
        const reactionCount =
          await this.reactionRepository.countReactionsByTipId(tip.id);
        const spot = await this.spotRepository.getSpotById(tip.spotId);

        if (!spot) {
          throw new Error(`해당 팁에 대한 Spot 정보를 찾을 수 없습니다.`);
        }

        return {
          id: tip.id,
          spotImg: spot.img,
          category: spot.category,
          spotName: spot.name,
          createdAt: tip.createdAt,
          reactionCount,
          spotId: spot.id,
        };
      })
    );

    if (sort === "latest") {
      enrichedTips.sort(
        (a, b) => b.createdAt.getTime() - a.createdAt.getTime()
      );
    } else if (sort === "popular") {
      enrichedTips.sort((a, b) => b.reactionCount - a.reactionCount);
    }

    return enrichedTips.map((tip) => ({
      id: tip.id,
      spotImg: tip.spotImg,
      category: tip.category,
      spotName: tip.spotName,
      spotId: tip.spotId,
    }));
  }
}
