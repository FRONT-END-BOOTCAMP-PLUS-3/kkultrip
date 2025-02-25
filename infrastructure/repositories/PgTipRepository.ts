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
}
