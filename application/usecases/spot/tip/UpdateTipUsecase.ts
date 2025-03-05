import { ImageRepository } from "@/domain/repositories/ImageRepository";
import TipRepository from "@/domain/repositories/TipRepository";

export class UpdateTipUsecase {
  constructor(
    private tipRepo: TipRepository,
    private imageRepo: ImageRepository
  ) {}

  async execute(
    tipId: number,
    description: string,
    price: number,
    waitingTime: number,
    newImagePaths: string[]
  ) {
    // 1️. 팁 정보 업데이트
    const updatedTip = await this.tipRepo.updateTip(
      tipId,
      description,
      price,
      waitingTime
    );

    // 2️. 기존 이미지 삭제 후 새로운 이미지 등록
    await this.imageRepo.deleteImagesByTipId(tipId);
    if (newImagePaths.length > 0) {
      await this.imageRepo.uploadImages(tipId, newImagePaths);
    }

    return updatedTip;
  }
}
