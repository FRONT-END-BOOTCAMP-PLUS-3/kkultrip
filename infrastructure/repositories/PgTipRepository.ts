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
    try {
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
    } catch (error) {
      console.log("❌ createTip 오류 발생:", error);
      throw new Error("Tip 생성 중 오류가 발생했습니다.");
    } finally {
      await prisma.$disconnect();
    }
  }

  async getTipById(tipId: number) {
    try {
      return await prisma.tip.findUnique({
        where: { id: tipId },
      });
    } catch (error) {
      console.log("❌ getTipById 오류 발생:", error);
      throw new Error("해당 Tip을 가져오는 데 실패했습니다.");
    } finally {
      await prisma.$disconnect();
    }
  }

  async updateTip(
    tipId: number,
    description: string,
    price: number,
    waitingTime: number
  ) {
    try {
      return await prisma.tip.update({
        where: { id: tipId },
        data: {
          description,
          price,
          waitingTime,
          updatedAt: new Date(),
        },
      });
    } catch (error) {
      console.log("❌ updateTip 오류 발생:", error);
      throw new Error("Tip 업데이트 중 오류가 발생했습니다.");
    } finally {
      await prisma.$disconnect();
    }
  }

  async getAllTips(): Promise<Tip[]> {
    try {
      return await prisma.tip.findMany();
    } catch (error) {
      console.log("❌ getAllTips 오류 발생:", error);
      throw new Error("모든 Tip을 가져오는 데 실패했습니다.");
    } finally {
      await prisma.$disconnect();
    }
  }

  async getTipsBySpotId(
    spotId: number,
    orderBy: "createdAt" | "reactionCount"
  ): Promise<Tip[]> {
    try {
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
    } catch (error) {
      console.log("❌ getTipsBySpotId 오류 발생:", error);
      throw new Error("명소의 Tip을 가져오는 데 실패했습니다.");
    } finally {
      await prisma.$disconnect();
    }
  }

  async countBySpot(spotId: number): Promise<number> {
    try {
      return await prisma.tip.count({ where: { spotId } });
    } catch (error) {
      console.log("❌ countBySpot 오류 발생:", error);
      throw new Error("해당 명소의 Tip 개수를 가져오는 데 실패했습니다.");
    } finally {
      await prisma.$disconnect();
    }
  }

  async updateTipReportCount(tipId: number): Promise<void> {
    try {
      await prisma.tip.update({
        where: { id: tipId },
        data: { reportCnt: { increment: 1 } },
      });
    } catch (error) {
      console.log("❌ updateTipReportCount 오류 발생:", error);
      throw new Error("Tip 신고 수 업데이트 중 오류가 발생했습니다.");
    } finally {
      await prisma.$disconnect();
    }
  }

  async deleteTip(tipId: number): Promise<void> {
    try {
      await prisma.tip.delete({
        where: { id: tipId },
      });
    } catch (error) {
      console.log("❌ deleteTip 오류 발생:", error);
      throw new Error("Tip 삭제 중 오류가 발생했습니다.");
    } finally {
      await prisma.$disconnect();
    }
  }

  async getTipsByUserId(userId: string): Promise<Tip[]> {
    try {
      return await prisma.tip.findMany({
        where: { userId },
      });
    } catch (error) {
      console.log("❌ getTipsByUserId 오류 발생:", error);
      throw new Error("해당 유저의 Tip을 가져오는 데 실패했습니다.");
    } finally {
      await prisma.$disconnect();
    }
  }
}
