import { Reaction } from "@prisma/client";
import { CreatedReactionDto } from "@/application/usecases/spot/tips/dto/CreatedReactionDto";
export default interface ReactionRepository {
    getReactionsByTipId(tipId: number): Promise<Reaction[]>;
    createReaction(reaction: Reaction): Promise<CreatedReactionDto>;
    getReaction(tipId: number, userId: string): Promise<Reaction | null>;
    updateReaction(reaction: Reaction): Promise<void>;
    deleteReaction(tipId: number, userId: string): Promise<void>;
}
