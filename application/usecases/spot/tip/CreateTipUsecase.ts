import TipRepository from "@/domain/repositories/TipRepository";

export class CreateTipUsecase {
  constructor(private tipRepo: TipRepository) {}

  async execute(
    spotId: number,
    userId: string,
    description: string,
    price: number,
    waitingTime: number
  ) {
    return await this.tipRepo.createTip(
      spotId,
      userId,
      description,
      price,
      waitingTime
    );
  }
}
