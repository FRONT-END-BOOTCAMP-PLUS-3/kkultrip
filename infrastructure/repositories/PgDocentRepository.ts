import { DocentRepository } from "@/domain/repositories/DocentRepository";
import { prisma } from "@/lib/prisma";
import { Docent } from "@prisma/client";

export class PgDocentRepository implements DocentRepository {
  async createDocent(docent: Docent): Promise<Docent> {
    return await prisma.docent.create({
      data: {
        title: docent.title,
        description: docent.description,
        audioPath: docent.audioPath,
        spotId: docent.spotId,
      },
    });
  }

  async updateDocent(id: number, docent: Docent): Promise<Docent> {
    return await prisma.docent.update({
      where: { id },
      data: docent,
    });
  }

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

  async deleteDocent(id: number): Promise<Docent | null> {
    try {
      return await prisma.docent.delete({
        where: { id },
      });
    } catch (error) {
      console.log("❌ deleteDocent 오류 발생:", error);
      throw new Error("도슨트를 삭제하는 데 실패했습니다.");
    }
  }
}
