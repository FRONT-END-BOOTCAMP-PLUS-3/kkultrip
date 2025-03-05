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

  async countBySpot(spotId: number): Promise<number> {
    try {
      return await prisma.tip.count({ where: { spotId } });
    } catch (error) {
      console.log("❌ countBySpot 오류 발생:", error);
      throw new Error("해당 명소의 꿀팁 개수를 가져오는 데 실패했습니다.");
    } finally {
      await prisma.$disconnect();
    }
  }
}
