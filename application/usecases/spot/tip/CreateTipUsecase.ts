import TipRepository from "@/domain/repositories/TipRepository";
import { ImageRepository } from "@/domain/repositories/ImageRepository";
import { CreateTipDto } from "./dto/CreateTipDto";
import SpotRepository from "@/domain/repositories/SpotRepository";

export class CreateTipUsecase {
  constructor(
    private tipRepo: TipRepository,
    private imageRepo: ImageRepository,
    private spotRepo: SpotRepository
  ) {}

  async execute(dto: CreateTipDto) {
    // 1️. 팁 정보 저장
    const newTip = await this.tipRepo.createTip(
      dto.spotId,
      dto.userId,
      dto.description,
      dto.price,
      dto.waitingTime
    );

    // 2️. 이미지 저장 및 경로 반환
    await this.imageRepo.createImages(newTip.id, dto.images);

    // 3. 현재 Spot의 평균 값 가져오기
    const spotAvg = await this.spotRepo.getSpotAvg(dto.spotId);
    const tipCount = await this.tipRepo.countBySpot(dto.spotId);

    // 4. 새로운 평균 값 계산
    const newAvgPrice =
      ((spotAvg?.avgPrice || 0) * (tipCount - 1) + dto.price) / tipCount;
    const newAvgWaitingTime =
      ((spotAvg?.avgWaitingTime || 0) * (tipCount - 1) + dto.waitingTime) /
      tipCount;

    // 5. Spot의 평균 가격과 대기시간 업데이트
    await this.spotRepo.updateSpotAvg(
      dto.spotId,
      newAvgPrice,
      newAvgWaitingTime
    );
  }
}
