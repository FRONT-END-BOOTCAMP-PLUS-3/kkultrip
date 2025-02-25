import TipRepository from "@/domain/repositories/TipRepository";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export class PgTipRepository implements TipRepository {
  async countBySpot(spotId: number): Promise<number> {
    return prisma.tip.count({ where: { spotId } });
  }
}
