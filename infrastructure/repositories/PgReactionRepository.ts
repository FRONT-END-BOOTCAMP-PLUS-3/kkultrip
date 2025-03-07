import { CreatedReactionDto } from "@/application/usecases/spot/tips/dto/CreatedReactionDto";
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
    async createReaction(reaction: Reaction): Promise<CreatedReactionDto> {
        try {
            const createdReaction = await prisma.reaction.create({
                data: {
                    tipId: reaction.tipId,
                    userId: reaction.userId,
                    type: reaction.type,
                },
            });
            return {
                tipId: createdReaction.tipId,
                userId: createdReaction.userId,
                type: createdReaction.type,
            };
        } catch (error) {
            console.error("Error creating reaction:", error);
            throw error;
        }
    }

    async updateReaction(reaction: Reaction): Promise<void> {
        try {
            await prisma.reaction.update({
                where: {
                    tipId_userId: {
                        tipId: reaction.tipId,
                        userId: reaction.userId,
                    },
                },
                data: {
                    type: reaction.type,
                },
            });
        } catch (error) {
            console.error("Error updating reaction:", error);
            throw error;
        }
    }

    async deleteReaction(tipId: number, userId: string): Promise<void> {
        try {
            await prisma.reaction.delete({
                where: {
                    tipId_userId: {
                        tipId: tipId,
                        userId: userId,
                    },
                },
            });
        } catch (error) {
            console.error("Error deleting reaction:", error);
            throw error;
        }
    }
}
