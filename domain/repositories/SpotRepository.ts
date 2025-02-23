import { Spot } from "@/domain/entities/Spot";

export interface SpotRepository {
  getAllSpots(): Promise<Spot[]>;
  createSpot(spot: Omit<Spot, "id" | "createdAt" | "updatedAt">): Promise<void>;
}
