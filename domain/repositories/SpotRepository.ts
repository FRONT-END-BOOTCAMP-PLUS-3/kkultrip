import { Spot } from "@prisma/client";

export default interface SpotRepository {
  getAllSpots(): Promise<Spot[]>;

  getSpotById(id: number): Promise<Spot | null>;

  createSpot(spot: Spot): Promise<Spot>;

  updateSpot(id: number, spot: Spot): Promise<Spot | null>;

  deleteSpot(id: number): Promise<Spot | null>;

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
