import TipRepository from "@/domain/repositories/TipRepository";
import { ImageRepository } from "@/domain/repositories/ImageRepository";

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
    images: File[]
  ) {
    // 1️. 팁 정보 저장
    const newTip = await this.tipRepo.createTip(
      spotId,
      userId,
      description,
      price,
      waitingTime
    );

    // 2️. 이미지 저장 및 경로 반환
    const imagePaths = await this.imageRepo.CreateImages(newTip.id, images);

    return { ...newTip, images: imagePaths };
  }
}
