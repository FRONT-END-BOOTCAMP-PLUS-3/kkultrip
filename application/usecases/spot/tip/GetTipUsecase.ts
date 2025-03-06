import { ImageRepository } from "@/domain/repositories/ImageRepository";
import TipRepository from "@/domain/repositories/TipRepository";
import { GetTipDto } from "./dto/GetTipDto";

export class GetTipUsecase {
  constructor(
    private tipRepo: TipRepository,
    private imageRepo: ImageRepository
  ) {}

  async execute(tipId: number) {
    // 1️. 팁 가져오기
    const tip = await this.tipRepo.getTipById(tipId);
    if (!tip) return null;

    // 2️. 해당 팁의 이미지 가져오기
    const images = await this.imageRepo.getImagesByTipId(tipId);

    const tipWithImg: GetTipDto = { ...tip, images };

    return tipWithImg;
  }
}
