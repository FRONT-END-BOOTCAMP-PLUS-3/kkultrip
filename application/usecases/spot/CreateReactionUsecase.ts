import ReactionRepository from "@/domain/repositories/ReactionRepository";
import { CreateReactionDto } from "./dto/CreateReactionDto";

export default class CreateReactionUsecase {
    constructor(private reactionRepository: ReactionRepository) {}

    async execute(reaction: CreateReactionDto): Promise<void> {
        await this.reactionRepository.createReaction({
            tipId: reaction.tipId,
            userId: reaction.userId,
            type: reaction.type,
            createdAt: new Date(),
            updatedAt: new Date(),
        });
    }
}
