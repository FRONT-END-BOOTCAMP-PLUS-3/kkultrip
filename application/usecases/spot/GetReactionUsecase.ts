import ReactionRepository from "@/domain/repositories/ReactionRepository";
import { ReactionDto } from "./dto/ReactionDto";

export default class GetReactionUsecase {
    constructor(private reactionRepository: ReactionRepository) {}

    async execute(tipId: number, userId: string): Promise<ReactionDto | null> {
        const reaction = await this.reactionRepository.getReaction(
            tipId,
            userId
        );

        if (!reaction) {
            return null;
        }

        return {
            tipId: reaction.tipId,
            userId: reaction.userId,
            type: reaction.type,
        };
    }
}
