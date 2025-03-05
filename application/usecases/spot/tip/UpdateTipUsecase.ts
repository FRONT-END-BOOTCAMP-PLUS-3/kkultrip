import TipRepository from "@/domain/repositories/TipRepository";

export class UpdateTipUsecase {
  constructor(private tipRepo: TipRepository) {}

  async execute(
    tipId: number,
    description: string,
    price: number,
    waitingTime: number
  ) {
    return await this.tipRepo.updateTip(tipId, description, price, waitingTime);
  }
}
