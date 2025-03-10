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
      const spot = await this.spotRepository.getSpotByName(spotName);

      if (!spot) {
        throw new Error("명소를 찾을 수 없습니다.");
      }

      const tips = await this.tipRepository.getTipsBySpotId(spot.id, orderBy);

      // GetTipListDto 형태로 변환
      return tips.map(
        (tip): GetTipListDto => ({
          id: tip.id,
          spotId: tip.spotId,
          spotName: spotName,
          userId: tip.userId,
          description: tip.description,
          price: tip.price,
          waitingTime: tip.waitingTime,
          reportCnt: tip.reportCnt,
          createdAt: tip.createdAt,
          updatedAt: tip.updatedAt,
        })
      );
    } catch (error) {
      console.error("❌ GetTipBySpotNameUseCase 오류 발생:", error);
      throw new Error("명소 팁 데이터를 가져오는 데 실패했습니다.");
    }
  }
}
