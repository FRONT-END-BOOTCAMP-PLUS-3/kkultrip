import { prisma } from "@/lib/prisma";
import { Reaction } from "@prisma/client";

export default class PgReactionRepository {
    async getReactionsByTipId(tipId: number): Promise<Reaction[]> {
        return await prisma.reaction.findMany({ where: { tipId } });
    }

    async createReaction(reaction: Reaction): Promise<void> {
        await prisma.reaction.create({
            data: {
                tipId: reaction.tipId,
                userId: reaction.userId,
                type: reaction.type,
            },
        });
    }
}
