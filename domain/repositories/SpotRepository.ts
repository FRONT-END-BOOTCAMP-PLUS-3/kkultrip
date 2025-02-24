import { Spot } from "@prisma/client";

export interface SpotRepository {
  getAllSpots(): Promise<Spot[]>;
  createSpot(spot: Omit<Spot, "id" | "createdAt" | "updatedAt">): Promise<Spot>; // Spot 반환
}
