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
}
