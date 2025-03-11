import { PgUserRepository } from "@/infrastructure/repositories/PgUserRepository";
import { PgTipRepository } from "@/infrastructure/repositories/PgTipRepository";
import { PgImageRepository } from "@/infrastructure/repositories/PgImageRepository";
import PgSpotRepository from "@/infrastructure/repositories/PgSpotRepository";
import { GetUserDto } from "../user/dto/GetUserDto";
import { GetImageListDTO } from "./dto/GetImageListDto";

export class GetImageByUserNameUseCase {
  private userRepository: PgUserRepository;
  private tipRepository: PgTipRepository;
  private imageRepository: PgImageRepository;
  private spotRepository: PgSpotRepository;

  constructor(
    userRepository: PgUserRepository,
    tipRepository: PgTipRepository,
    imageRepository: PgImageRepository,
    spotRepository: PgSpotRepository
  ) {
    this.userRepository = userRepository;
    this.tipRepository = tipRepository;
    this.imageRepository = imageRepository;
    this.spotRepository = spotRepository;
  }

  // 유저 이름으로 유저들을 조회하고, 그 유저들이 쓴 팁을 조회 후, 팁에 관련된 이미지들을 반환
  async execute(nickname: string): Promise<GetImageListDTO[] | null> {
    const users = await this.userRepository.getUsersByPartialName(nickname);

    if (users!.length === 0) {
      throw new Error("User(s) not found");
    }

    const images: GetImageListDTO[] = [];

    for (const user of users!) {
      const tips = await this.tipRepository.getTipsByUserId(user.id);

      for (const tip of tips) {
        // 해당 팁의 이미지가 있는지 확인
        const imagesForTip = await this.imageRepository.getImageByTipId(tip.id);

        for (const image of imagesForTip) {
          if (image.path) {
            // 해당 팁에 대한 명소 정보 조회
            const spot = await this.spotRepository.getSpotById(tip.spotId);
            if (!spot) continue;

            const imageDTO: GetImageListDTO = {
              id: image.id,
              tipId: image.tipId,
              path: image.path,
              createdAt: image.createdAt,
              nickname: user.nickname,
              spotName: spot.name,
            };
            images.push(imageDTO);
          }
        }
      }
    }

    return images.length > 0 ? images : null;
  }
}
