import SpotRepository from "@/domain/repositories/SpotRepository";
import { GetSpotListDto } from "./dto/GetSpotListDto";

export class GetSpotsByNameUseCase {
  constructor(private spotReosirotry: SpotRepository) {}

  async execute(name: string): Promise<GetSpotListDto[]> {
    try {
      const spots = await this.spotReosirotry.getSpotsByPartialName(name);

      // 사용자가 존재하지 않으면 빈 배열 반환
      if (!spots) {
        return [];
      }
      return spots;
    } catch (error) {
      throw new Error("Error retrieving user by nickname");
    }
  }
}
