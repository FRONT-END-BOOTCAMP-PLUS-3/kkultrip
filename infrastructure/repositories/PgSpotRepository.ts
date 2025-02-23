import { prisma } from "@/lib/prisma";
import { Spot } from "@/domain/entities/Spot";
import { SpotRepository } from "@/domain/repositories/SpotRepository";

export class PgSpotRepository implements SpotRepository {
  async getAllSpots(): Promise<Spot[]> {
    return await prisma.spot.findMany(); // 프리즈마 스키마 파일과 형태가 달라서 에러 메세지 발생
  }

  async createSpot(
    spot: Omit<Spot, "id" | "createdAt" | "updatedAt"> & {
      info: string;
      avgPrice: number;
    }
  ): Promise<void> {
    await prisma.spot.create({
      data: spot,
    });
  }
}
