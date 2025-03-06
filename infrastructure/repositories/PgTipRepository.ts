import { prisma } from "@/lib/prisma";
import { Tip } from "@prisma/client";
import TipRepository from "@/domain/repositories/TipRepository";

export class PgTipRepository implements TipRepository {
  async createTip(
    spotId: number,
    userId: string,
    description: string,
    price: number,
    waitingTime: number
  ) {
    return await prisma.tip.create({
      data: {
        spotId,
        userId,
        description,
        price,
        waitingTime,
        reportCnt: 0,
      },
    });
  }

  async getTipById(tipId: number) {
    return await prisma.tip.findUnique({
      where: { id: tipId },
    });
  }

  async updateTip(
    tipId: number,
    description: string,
    price: number,
    waitingTime: number
  ) {
    return await prisma.tip.update({
      where: { id: tipId },
      data: {
        description,
        price,
        waitingTime,
        updatedAt: new Date(),
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

    return tipsWithReactionCount.sort(
      (a, b) => Number(b[orderBy]) - Number(a[orderBy])
    );
  }

  async countBySpot(spotId: number): Promise<number> {
    return prisma.tip.count({ where: { spotId } });
  }

  async updateTipReportCount(tipId: number): Promise<void> {
    await prisma.tip.update({
      where: { id: tipId },
      data: { reportCnt: { increment: 1 } },
    });
  }

    async deleteTip(tipId: number): Promise<void> {
        await prisma.tip.delete({ where: { id: tipId } });
    }
}
