import { PgTipRepository } from "@/infrastructure/repositories/PgTipRepository";
import PgSpotRepository from "@/infrastructure/repositories/PgSpotRepository";
import { GetTipListDto } from "./dto/GetTipListDto";

export default class GetTipBySpotNameUseCase {
  private tipRepository: PgTipRepository;
  private spotRepository: PgSpotRepository;

  constructor(
    tipRepository: PgTipRepository,
    spotRepository: PgSpotRepository
  ) {
    this.tipRepository = tipRepository;
    this.spotRepository = spotRepository;
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

        return tips.map(
          (tip): GetTipListDto => ({
            id: tip.id,
            spotId: tip.spotId,
            spotName: spot.name, // spotName을 각 스팟에서 가져옵니다.
            userId: tip.userId,
            description: tip.description,
            price: tip.price,
            waitingTime: tip.waitingTime,
            reportCnt: tip.reportCnt,
            createdAt: tip.createdAt,
            updatedAt: tip.updatedAt,
          })
        );
      });

      // 모든 팁을 배열로 합침
      const allTips = (await Promise.all(tipsPromises)).flat();

      return allTips;
    } catch (error) {
      console.error("❌ GetTipBySpotNameUseCase 오류 발생:", error);
      throw new Error("명소 팁 데이터를 가져오는 데 실패했습니다.");
    }
  }
}
