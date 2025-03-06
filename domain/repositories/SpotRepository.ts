import { Spot } from "@prisma/client";

export default interface SpotRepository {
  getAllSpots(): Promise<Spot[]>;

  getSpotById(id: number): Promise<Spot | null>; // 특정 Spot 조회

  createSpot(spot: Omit<Spot, "id" | "createdAt" | "updatedAt">): Promise<Spot>;

  updateSpot(id: number, spot: Partial<Spot>): Promise<Spot | null>; // 특정 Spot 수정

  deleteSpot(id: number): Promise<Spot | null>; // 특정 Spot 삭제

  getNearbySpots(
    lat: number,
    lng: number,
    category?: string,
    maxPrice?: number
  ): Promise<Spot[]>;

  getSpotByName(name: string): Promise<Spot | null>;

  getSpotAvg(
    spotId: number
  ): Promise<{ avgPrice: number; avgWaitingTime: number } | null>;
  updateSpotAvg(
    spotId: number,
    avgPrice: number | null,
    avgWaitingTime: number | null
  ): Promise<void>;
}
