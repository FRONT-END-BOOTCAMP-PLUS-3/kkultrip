import ReactionRepository from "@/domain/repositories/ReactionRepository";
import { CreateReactionDto } from "./dto/CreateReactionDto";

export default class CreateReactionUsecase {
    constructor(private reactionRepository: ReactionRepository) {}

    async execute(reaction: CreateReactionDto): Promise<void> {
        await this.reactionRepository.createReaction({
            ...reaction,
            createdAt: new Date(),
            updatedAt: new Date(),
        });
    }
}
