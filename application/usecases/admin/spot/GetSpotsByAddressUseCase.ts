import SpotRepository from "@/domain/repositories/SpotRepository";
import { GetSpotListDto } from "./dto/GetSpotListDto";

export class GetSpotsByAddressUseCase {
  constructor(private spotReosirotry: SpotRepository) {}

  async execute(address: string): Promise<GetSpotListDto[]> {
    try {
      const spots = await this.spotReosirotry.getSpotsByAddress(address);

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
