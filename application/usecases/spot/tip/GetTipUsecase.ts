import TipRepository from "@/domain/repositories/TipRepository";

export class GetTipUsecase {
  constructor(private tipRepo: TipRepository) {}

  async execute(tipId: number) {
    return await this.tipRepo.getTipById(tipId);
  }
}
