import { prisma } from "@/lib/prisma";
import SpotRepository  from "@/domain/repositories/SpotRepository";
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

  async deleteSpot(id: number): Promise<Spot | null> {
    try {
      return await prisma.spot.delete({
        where: { id },
      });
    } catch (error) {
      console.error("Error deleting spot:", error);
      return null; // 존재하지 않는 경우를 고려해 null 반환
    }
  }

  async getNearbySpots(
    lat: number,
    lng: number,
    category?: string,
    maxPrice?: number
  ): Promise<Spot[]> {
    return prisma.spot.findMany({
      where: {
        category: category ? category : undefined,
        avgPrice: maxPrice ? { lte: maxPrice } : undefined,
        lat: { gte: lat - 0.01, lte: lat + 0.01 },
        lon: { gte: lng - 0.01, lte: lng + 0.01 },
      },
    });
  }
}
