import TipRepository from "@/domain/repositories/TipRepository";
import { GetTipDto } from "./dto/GetTipDto";

export class GetTipsUseCase {
  constructor(private tipRepository: TipRepository) {}

  async execute(): Promise<GetTipDto[]> {
    const tips = await this.tipRepository.getAllTips();

    return tips.map((tip) => ({
      id: tip.id,
      spotId: tip.spotId,
      userId: tip.userId,
      description: tip.description,
      price: tip.price,
      reportCnt: tip.reportCnt,
      createdAt: tip.createdAt.toISOString(),
      updatedAt: tip.updatedAt.toISOString(),
    }));
  }
}
