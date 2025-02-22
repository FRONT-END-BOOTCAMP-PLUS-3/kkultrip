import { prisma } from "@/lib/prisma";
import { Spot } from "@/domain/entities/Spot";

export class GetSpotUseCase {
  async execute(): Promise<Spot[]> {
    return await prisma.spot.findMany();
  }
}
