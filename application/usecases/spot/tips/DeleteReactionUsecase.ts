import ReactionRepository from "@/domain/repositories/ReactionRepository";

export default class DeleteReactionUsecase {
    constructor(private reactionRepository: ReactionRepository) {}

    async execute(tipId: number, userId: string): Promise<void> {
        await this.reactionRepository.deleteReaction(tipId, userId);
    }
}
