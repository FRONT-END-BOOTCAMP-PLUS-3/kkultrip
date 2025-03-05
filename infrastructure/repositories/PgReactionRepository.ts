import ReactionRepository from "@/domain/repositories/ReactionRepository";
import { prisma } from "@/lib/prisma";
import { Reaction } from "@prisma/client";

export default class PgReactionRepository implements ReactionRepository {
    async getReactionsByTipId(tipId: number): Promise<Reaction[]> {
        try {
            return prisma.reaction.findMany({ where: { tipId } });
        } catch (error) {
            console.error("Error fetching reactions by tipId:", error);
            throw error;
        }
    }

    async getReaction(tipId: number, userId: string): Promise<Reaction | null> {
        try {
            return prisma.reaction.findUnique({
                where: { tipId_userId: { tipId, userId } },
            });
        } catch (error) {
            console.error("Error fetching reaction:", error);
            throw error;
        }
    }
    async createReaction(reaction: Reaction): Promise<void> {
        try {
            await prisma.reaction.create({
                data: {
                    tipId: reaction.tipId,
                    userId: reaction.userId,
                    type: reaction.type,
                },
            });
        } catch (error) {
            console.error("Error creating reaction:", error);
            throw error;
        }
    }
}
