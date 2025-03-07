import { prisma } from "@/lib/prisma";
import { Docent } from "@prisma/client";
import DocentRepository from "@/domain/repositories/DocentRepository";

export default class PgDocentRepository implements DocentRepository {
  async getDocentBySpotId(spotId: number): Promise<Docent[] | null> {
    try {
      return await prisma.docent.findMany({
        where: {
          spotId,
        },
      });
    } catch (error) {
      console.log("❌ getDocentBySpotId 오류 발생:", error);
      throw new Error("해당 명소의 도슨트 정보를 가져오는 데 실패했습니다.");
    } finally {
      await prisma.$disconnect();
    }
  }
}
