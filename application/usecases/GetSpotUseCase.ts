import { prisma } from "@/lib/prisma";
import { Spot } from "@/domain/entities/Spot";

export class GetSpotUseCase {
  async execute(): Promise<Spot[]> {
    return await prisma.spot.findMany(); // 프리즈마 스키마 파일과 형태가 달라서 에러 메세지 발생
  }
}
