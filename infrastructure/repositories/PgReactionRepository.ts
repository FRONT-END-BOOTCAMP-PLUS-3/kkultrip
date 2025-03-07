import ReactionRepository from "@/domain/repositories/ReactionRepository";
import { prisma } from "@/lib/prisma";
import { Reaction } from "@prisma/client";

export default class PgReactionRepository implements ReactionRepository {
  async getReactionsByTipId(tipId: number): Promise<Reaction[]> {
    try {
      return await prisma.reaction.findMany({ where: { tipId } });
    } catch (error) {
      console.error("❌ getReactionsByTipId 오류 발생:", error);
      throw new Error("해당 Tip의 반응 정보를 가져오는 데 실패했습니다.");
    } finally {
      await prisma.$disconnect();
    }
  }

  async getReaction(tipId: number, userId: string): Promise<Reaction | null> {
    try {
      return await prisma.reaction.findUnique({
        where: { tipId_userId: { tipId, userId } },
      });
    } catch (error) {
      console.error("❌ getReaction 오류 발생:", error);
      throw new Error("특정 유저의 반응 정보를 가져오는 데 실패했습니다.");
    } finally {
      await prisma.$disconnect();
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
      console.error("❌ createReaction 오류 발생:", error);
      throw new Error("반응 생성 중 오류가 발생했습니다.");
    } finally {
      await prisma.$disconnect();
    }
  }
}
