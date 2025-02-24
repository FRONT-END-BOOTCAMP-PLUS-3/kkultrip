import { prisma } from "@/lib/prisma";
import { SpotRepository } from "@/domain/repositories/SpotRepository";
import { Spot } from "@prisma/client"; // Prisma의 Spot 타입 사용

export class PgSpotRepository implements SpotRepository {
  async getAllSpots(): Promise<Spot[]> {
    return await prisma.spot.findMany();
  }

  async getSpotById(id: number): Promise<Spot | null> {
    return await prisma.spot.findUnique({
      where: { id },
    });
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

  async updateSpot(id: number, data: Partial<Spot>): Promise<Spot | null> {
    return await prisma.spot.update({
      where: { id },
      data,
    });
  }
}
