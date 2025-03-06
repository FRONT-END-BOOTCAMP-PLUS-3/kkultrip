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

    // 2. 기존 이미지 중 유지할 것들 제외하고 삭제
    const currentImagePaths = await this.imageRepo.getImagesByTipId(dto.tipId);

    // 기존 이미지 중 유지하지 않는 것들만 삭제
    const imagesToDelete = currentImagePaths.filter(
      (imgPath) => !dto.existingImagePaths.includes(imgPath)
    );

    if (imagesToDelete.length > 0) {
      await this.imageRepo.deleteImagesByPaths(imagesToDelete);
    }

    // 3. 새 이미지 업로드 (있다면 추가)
    if (dto.newImageFiles.length > 0) {
      await this.imageRepo.createImages(dto.tipId, dto.newImageFiles);
    }

    return updatedTip;
  }
}
