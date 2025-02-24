import { prisma } from "@/lib/prisma";
import { Spot } from "@/domain/entities/Spot";
import { SpotRepository } from "@/domain/repositories/SpotRepository";

export class PgSpotRepository implements SpotRepository {
  async getAllSpots(): Promise<Spot[]> {
    return await prisma.spot.findMany();
  }

  async createSpot(
    spot: Omit<Spot, "id" | "createdAt" | "updatedAt">
  ): Promise<Spot> {
    return await prisma.spot.create({
      data: {
        ...spot,
        info: spot.info || "",
        avgPrice: spot.avgPrice ?? 0,
        avgWaitingTime: spot.avgWaitingTime ?? 0,
      },
    });
  }
}
