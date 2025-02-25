import SpotRepository from "@/domain/repositories/SpotRepository";
import { PrismaClient, Spot } from "@prisma/client";

const prisma = new PrismaClient();

export class PgSpotRepository implements SpotRepository {
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
