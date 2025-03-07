import ReactionRepository from "@/domain/repositories/ReactionRepository";
import { CreateReactionDto } from "./dto/CreateReactionDto";
import { CreatedReactionDto } from "./dto/CreatedReactionDto";
export default class CreateReactionUsecase {
    constructor(private reactionRepository: ReactionRepository) {}

    async execute(reaction: CreateReactionDto): Promise<CreatedReactionDto> {
        return await this.reactionRepository.createReaction({
            ...reaction,
            createdAt: new Date(),
            updatedAt: new Date(),
        });
    }
}
