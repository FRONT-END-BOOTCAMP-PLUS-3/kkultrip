import { Reaction } from "@prisma/client";

export default interface ReactionRepository {
    getReactionsByTipId(tipId: number): Promise<Reaction[]>;
    createReaction(reaction: Reaction): Promise<void>;
    getReaction(tipId: number, userId: string): Promise<Reaction | null>;
}
