import { Reaction } from "@prisma/client";

export default interface ReactionRepository {
    getReactionsByTipId(tipId: number): Promise<Reaction[]>;
}
