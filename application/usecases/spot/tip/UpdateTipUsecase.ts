import { ImageRepository } from "@/domain/repositories/ImageRepository";
import TipRepository from "@/domain/repositories/TipRepository";
import { UpdateTipDto } from "./dto/UpdateTipDto";
import SpotRepository from "@/domain/repositories/SpotRepository";

export class UpdateTipUsecase {
  constructor(
    private tipRepo: TipRepository,
    private imageRepo: ImageRepository,
    private spotRepo: SpotRepository
  ) {}

  async execute(dto: UpdateTipDto) {
    // 1. 기존 팁 정보 가져오기
    const existingTip = await this.tipRepo.getTipById(dto.tipId);
    if (!existingTip) {
      throw new Error("해당 팁을 찾을 수 없습니다.");
    }
    // 2. 팁 정보 업데이트
    await this.tipRepo.updateTip(
      dto.tipId,
      dto.description,
      dto.price,
      dto.waitingTime
    );

    // 3. 기존 이미지 중 유지할 것들 제외하고 삭제
    const currentImagePaths = await this.imageRepo.getImagesByTipId(dto.tipId);

    // 4. 기존 이미지 중 유지하지 않는 것들만 삭제
    const imagesToDelete = currentImagePaths.filter(
      (imgPath) => !dto.existingImagePaths.includes(imgPath)
    );

    if (imagesToDelete.length > 0) {
      await this.imageRepo.deleteImagesByPaths(imagesToDelete);
    }

    // 5. 새 이미지 업로드 (있다면 추가)
    if (dto.newImageFiles.length > 0) {
      await this.imageRepo.createImages(dto.tipId, dto.newImageFiles);
    }

    //  6. Spot의 평균 가격과 대기시간 업데이트
    const spotId = existingTip.spotId;
    const spotAvg = await this.spotRepo.getSpotAvg(spotId);
    const tipCount = await this.tipRepo.countBySpot(spotId);
    if (!spotAvg) {
      throw new Error("해당 평균값을 찾을 수 없습니다.");
    }

    // 7. 새로운 평균 값 계산
    const newAvgPrice =
      tipCount > 0
        ? (spotAvg.avgPrice * tipCount - existingTip.price + dto.price) /
          tipCount
        : dto.price;

    const newAvgWaitingTime =
      tipCount > 0
        ? (spotAvg.avgWaitingTime * tipCount -
            existingTip.waitingTime +
            dto.waitingTime) /
          tipCount
        : dto.waitingTime;

    // 8. 평균 업데이트
    await this.spotRepo.updateSpotAvg(spotId, newAvgPrice, newAvgWaitingTime);
  }
}
