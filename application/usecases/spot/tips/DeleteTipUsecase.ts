import TipRepository from "@/domain/repositories/TipRepository";

export default class DeleteTipUsecase {
    constructor(private tipRepository: TipRepository) {}

    async execute(tipId: number): Promise<void> {
        await this.tipRepository.deleteTip(tipId);
    }
}
