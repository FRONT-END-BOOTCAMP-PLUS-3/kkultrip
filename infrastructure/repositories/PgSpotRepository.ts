import SpotRepository from "@/domain/repositories/SpotRepository";
import { prisma } from "@/lib/prisma";
import { Spot } from "@prisma/client"; // Prisma의 Spot 타입 사용

export default class PgSpotRepository implements SpotRepository {
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

  async updateSpot(id: number, spot: Partial<Spot>): Promise<Spot | null> {
    return await prisma.spot.update({
      where: { id },
      data: spot,
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
    try {
      const spots = await prisma.spot.findMany({
        where: {
          category: category ? category : undefined,
          avgPrice: maxPrice !== undefined ? { lte: maxPrice } : undefined,
          lat: { gte: lat - 0.02, lte: lat + 0.02 }, // 위도(lat), 경도(lon)를 ± 0.02 정도로 검색 => 대략 2.2km
          lon: { gte: lng - 0.02, lte: lng + 0.02 },
        },
      });

      return spots;
    } catch (error) {
      console.log("❌ getNearbySpots 오류 발생:", error);
      throw new Error("명소 데이터를 가져오지 못했습니다.");
    } finally {
      await prisma.$disconnect();
    }
  }

  async getSpotByName(name: string): Promise<Spot | null> {
    try {
      const spot = await prisma.spot.findFirst({
        where: {
          name: {
            contains: name, // 부분 검색 가능
            mode: "insensitive", // 대소문자 구분 없이 검색
          },
        },
      });

      return spot;
    } catch (error) {
      console.log("❌ getSpotByName 오류 발생:", error);
      throw new Error("명소 데이터를 가져오지 못했습니다.");
    } finally {
      await prisma.$disconnect();
    }
  }
}
