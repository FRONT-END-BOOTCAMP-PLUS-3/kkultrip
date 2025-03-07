import SpotRepository from "@/domain/repositories/SpotRepository";
import { prisma } from "@/lib/prisma";
import { Spot } from "@prisma/client";

export default class PgSpotRepository implements SpotRepository {
  async getAllSpots(): Promise<Spot[]> {
    try {
      return await prisma.spot.findMany();
    } catch (error) {
      console.error("❌ getAllSpots 오류 발생:", error);
      throw new Error("모든 명소 데이터를 가져오지 못했습니다.");
    } finally {
      await prisma.$disconnect();
    }
  }

  async getSpotById(id: number): Promise<Spot | null> {
    try {
      return await prisma.spot.findUnique({
        where: { id },
      });
    } catch (error) {
      console.error("❌ getSpotById 오류 발생:", error);
      throw new Error("명소 데이터를 가져오지 못했습니다.");
    } finally {
      await prisma.$disconnect();
    }
  }

  async createSpot(spot: Spot): Promise<Spot> {
    return await prisma.spot.create({
      data: {
        name: spot.name,
        address: spot.address,
        lon: spot.lon,
        lat: spot.lat,
        phone: spot.phone,
        info: spot.info,
        category: spot.category,
        link: spot.link ?? null,
        img: spot.img,
      },
    });
  }

  async updateSpot(id: number, spot: Spot): Promise<Spot | null> {
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
      console.error("❌ deleteSpot 오류 발생:", error);
      throw new Error("명소 삭제 중 오류가 발생했습니다.");
    } finally {
      await prisma.$disconnect();
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
          lat: { gte: lat - 0.02, lte: lat + 0.02 }, // 대략 반경 2.2km 검색
          lon: { gte: lng - 0.02, lte: lng + 0.02 },
        },
      });

      return spots;
    } catch (error) {
      console.log("❌ getNearbySpots 오류 발생:", error);
      throw new Error("근처 명소 데이터를 가져오지 못했습니다.");
    } finally {
      await prisma.$disconnect();
    }
  }

  async getSpotByName(name: string): Promise<Spot | null> {
    try {
      return await prisma.spot.findFirst({
        where: {
          name: {
            contains: name, // 부분 검색 가능
            mode: "insensitive", // 대소문자 구분 없이 검색
          },
        },
      });
    } catch (error) {
      console.log("❌ getSpotByName 오류 발생:", error);
      throw new Error("명소 데이터를 가져오지 못했습니다.");
    } finally {
      await prisma.$disconnect();
    }
  }

  async getSpotAvg(spotId: number) {
    try {
      const spot = await prisma.spot.findUnique({
        where: { id: spotId },
        select: { avgPrice: true, avgWaitingTime: true },
      });

      return spot
        ? {
            avgPrice: spot.avgPrice ?? 0,
            avgWaitingTime: spot.avgWaitingTime ?? 0,
          }
        : null;
    } catch (error) {
      console.log("❌ getSpotAvg 오류 발생:", error);
      throw new Error("명소 평균 데이터를 가져오는 데 실패했습니다.");
    } finally {
      await prisma.$disconnect();
    }
  }

  async updateSpotAvg(
    spotId: number,
    avgPrice: number,
    avgWaitingTime: number
  ) {
    try {
      await prisma.spot.update({
        where: { id: spotId },
        data: {
          avgPrice: Math.round(avgPrice), // 반올림 처리
          avgWaitingTime: Math.round(avgWaitingTime),
        },
      });
    } catch (error) {
      console.log("❌ updateSpotAvg 오류 발생:", error);
      throw new Error("명소 평균 데이터를 업데이트하는 데 실패했습니다.");
    } finally {
      await prisma.$disconnect();
    }
  }
}
