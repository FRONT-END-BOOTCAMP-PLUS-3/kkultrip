import TipRepository from "@/domain/repositories/TipRepository";
import { ImageRepository } from "@/domain/repositories/ImageRepository";
import { CreateTipDto } from "./dto/CreateTipDto";

export class CreateTipUsecase {
  constructor(
    private tipRepo: TipRepository,
    private imageRepo: ImageRepository
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
    await this.imageRepo.CreateImages(newTip.id, dto.images);
  }
}
