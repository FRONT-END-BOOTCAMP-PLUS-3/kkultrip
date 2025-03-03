import { prisma } from "@/lib/prisma";
import { Tip } from "@prisma/client";
import TipRepository from "@/domain/repositories/TipRepository";

export class PgTipRepository implements TipRepository {
    async createTip(spotId: number): Promise<void> {
        await prisma.tip.create({
            data: {
                spotId,
                userId: "1",
                description: "example",
                price: 0,
                reportCnt: 0,
            },
        });
    }

    async getAllTips(): Promise<Tip[]> {
        return await prisma.tip.findMany();
    }

    async getTipsBySpotId(
        spotId: number,
        orderBy: "createdAt" | "reactionCount"
    ): Promise<Tip[]> {
        const tips = await prisma.tip.findMany({
            where: { spotId },
            include: {
                reactions: true,
            },
        });

        const tipsWithReactionCount = tips.map((tip) => ({
            ...tip,
            reactionCount: tip.reactions.length,
        }));

        return tipsWithReactionCount.sort((a, b) => Number(b[orderBy]) - Number(a[orderBy]));
    }

    async countBySpot(spotId: number): Promise<number> {
        return prisma.tip.count({ where: { spotId } });
    }
}
