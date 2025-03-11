import { PgImageRepository } from "@/infrastructure/repositories/PgImageRepository";
import { PgTipRepository } from "@/infrastructure/repositories/PgTipRepository";
import PgSpotRepository from "@/infrastructure/repositories/PgSpotRepository";
import { PgUserRepository } from "@/infrastructure/repositories/PgUserRepository";
import { GetImageListDTO } from "./dto/GetImageListDto";

export class GetImageListUseCase {
  constructor(
    private imageRepository: PgImageRepository,
    private tipRepository: PgTipRepository,
    private spotRepository: PgSpotRepository,
    private userRepository: PgUserRepository
  ) {}

  async execute(): Promise<GetImageListDTO[]> {
    const images = await this.imageRepository.getAllImages();

    const imageList: GetImageListDTO[] = [];

    for (const image of images) {
      const tip = await this.tipRepository.getTipById(image.tipId);
      if (!tip) continue;

      const spot = await this.spotRepository.getSpotById(tip.spotId);
      if (!spot) continue;

      const user = await this.userRepository.getUserById(tip.userId);

      imageList.push({
        id: image.id,
        tipId: image.tipId,
        path: image.path!,
        createdAt: image.createdAt,
        nickname: user!.nickname,
        spotName: spot.name,
      });
    }

    return imageList;
  }
}
