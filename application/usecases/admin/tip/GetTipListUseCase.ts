import TipRepository from "@/domain/repositories/TipRepository";
import { GetTipListDto } from "./dto/GetTipListDto";
import SpotRepository from "@/domain/repositories/SpotRepository";

export class GetTipListUseCase {
  constructor(
    private tipRepository: TipRepository,
    private spotRepository: SpotRepository
  ) {}

  async execute(): Promise<GetTipListDto[]> {
    const tips = await this.tipRepository.getAllTips();

    const tipListWithSpots: GetTipListDto[] = await Promise.all(
      tips.map(async (tip) => {
        const spot = await this.spotRepository.getSpotById(tip.spotId);

        return {
          id: tip.id,
          spotId: tip.spotId,
          spotName: spot!.name,
          userId: tip.userId,
          description: tip.description,
          price: tip.price,
          reportCnt: tip.reportCnt,
          waitingTime: tip.waitingTime,
          createdAt: tip.createdAt,
          updatedAt: tip.updatedAt,
        };
      })
    );

    return tipListWithSpots;
  }
}
