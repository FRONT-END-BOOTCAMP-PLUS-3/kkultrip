import { ImageRepository } from "@/domain/repositories/ImageRepository";
import TipRepository from "@/domain/repositories/TipRepository";
import { GetTipWithSpotDto } from "./dto/GetTipWithSpotDto";
import SpotRepository from "@/domain/repositories/SpotRepository";

export class GetTipWithSpotUsecase {
  constructor(
    private tipRepo: TipRepository,
    private imageRepo: ImageRepository,
    private spotRepo: SpotRepository
  ) {}

  async execute(tipId: number) {
    const tip = await this.tipRepo.getTipById(tipId);
    if (!tip) return null;

    const images = await this.imageRepo.getImagesByTipId(tipId);

    const spot = await this.spotRepo.getSpotById(tip.spotId);

    const tipWithSpot: GetTipWithSpotDto = {
      ...tip,
      images,
      spotName: spot!.name,
    };

    return tipWithSpot;
  }
}
