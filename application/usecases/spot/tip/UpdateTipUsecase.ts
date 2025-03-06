import { ImageRepository } from "@/domain/repositories/ImageRepository";
import TipRepository from "@/domain/repositories/TipRepository";
import { UpdateTipDto } from "./dto/UpdateTipDto";

export class UpdateTipUsecase {
  constructor(
    private tipRepo: TipRepository,
    private imageRepo: ImageRepository
  ) {}

  async execute(dto: UpdateTipDto) {
    // 1. 팁 정보 업데이트
    const updatedTip = await this.tipRepo.updateTip(
      dto.tipId,
      dto.description,
      dto.price,
      dto.waitingTime
    );

    // 2. 기존 이미지 삭제 후 새로운 이미지 등록
    await this.imageRepo.deleteImagesByTipId(dto.tipId);
    if (dto.images.length > 0) {
      await this.imageRepo.CreateImages(dto.tipId, dto.images);
    }

    return updatedTip;
  }
}
