import { Reaction } from "@prisma/client";

export default interface ReactionRepository {
    getReactionByTipId(tipId: number): Promise<Reaction[]>;
}
