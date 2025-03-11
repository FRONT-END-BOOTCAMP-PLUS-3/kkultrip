import { PgTipRepository } from "@/infrastructure/repositories/PgTipRepository";
import PgSpotRepository from "@/infrastructure/repositories/PgSpotRepository";
import { GetTipListDto } from "./dto/GetTipListDto";
import { PgUserRepository } from "@/infrastructure/repositories/PgUserRepository";

export default class GetTipBySpotNameUseCase {
  private tipRepository: PgTipRepository;
  private spotRepository: PgSpotRepository;
  private userRepository: PgUserRepository;

  constructor(
    tipRepository: PgTipRepository,
    spotRepository: PgSpotRepository,
    userRepository: PgUserRepository
  ) {
    this.tipRepository = tipRepository;
    this.spotRepository = spotRepository;
    this.userRepository = userRepository;
  }

  async execute(
    spotName: string,
    orderBy: "createdAt" | "reactionCount"
  ): Promise<GetTipListDto[]> {
    try {
      // 여러 개의 스팟을 가져옴
      const spots = await this.spotRepository.getSpotsByPartialName(spotName);

      if (!spots || spots.length === 0) {
        throw new Error("명소를 찾을 수 없습니다.");
      }

      // 여러 스팟에 대한 팁을 모두 가져옴
      const tipsPromises = spots.map(async (spot) => {
        const tips = await this.tipRepository.getTipsBySpotId(spot.id, orderBy);

        // 각 팁에 대해 유저 정보를 가져오는 부분을 수정
        const tipsWithUserInfo = await Promise.all(
          tips.map(async (tip) => {
            const user = await this.userRepository.getUserById(tip.userId);
            return {
              id: tip.id,
              spotId: tip.spotId,
              spotName: spot.name, // spotName을 각 스팟에서 가져옵니다.
              nickname: user!.nickname, // 유저의 nickname을 가져옵니다.
              description: tip.description,
              price: tip.price,
              waitingTime: tip.waitingTime,
              reportCnt: tip.reportCnt,
              createdAt: tip.createdAt,
              updatedAt: tip.updatedAt,
            };
          })
        );

        return tipsWithUserInfo;
      });

      // 모든 팁을 배열로 합침
      const allTips = (await Promise.all(tipsPromises)).flat();

      return allTips;
    } catch (error) {
      console.log("❌ GetTipBySpotNameUseCase 오류 발생:", error);
      throw new Error("명소 팁 데이터를 가져오는 데 실패했습니다.");
    }
  }
}
