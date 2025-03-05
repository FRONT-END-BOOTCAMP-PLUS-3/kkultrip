import { ImageRepository } from "@/domain/repositories/ImageRepository";
import TipRepository from "@/domain/repositories/TipRepository";

export class CreateTipUsecase {
  constructor(
    private tipRepo: TipRepository,
    private imageRepo: ImageRepository
  ) {}

  async execute(
    spotId: number,
    userId: string,
    description: string,
    price: number,
    waitingTime: number,
    imagePaths: string[]
  ) {
    // 1️. 팁 등록
    const tip = await this.tipRepo.createTip(
      spotId,
      userId,
      description,
      price,
      waitingTime
    );

    // 2️. 이미지 업로드
    if (imagePaths.length > 0) {
      await this.imageRepo.uploadImages(tip.id, imagePaths);
    }

    return tip;
  }
}
