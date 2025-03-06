import ReactionRepository from "@/domain/repositories/ReactionRepository";
import { UpdateReactionDto } from "./dto/UpdateReactionDto";

export class UpdateReactionUsecase {
    constructor(private reactionRepository: ReactionRepository) {}

    async execute(updateReactionDto: UpdateReactionDto): Promise<void> {
        await this.reactionRepository.updateReaction({
            tipId: updateReactionDto.tipId,
            userId: updateReactionDto.userId,
            type: updateReactionDto.type,
            createdAt: new Date(),
            updatedAt: new Date(),
        });
    }
}
