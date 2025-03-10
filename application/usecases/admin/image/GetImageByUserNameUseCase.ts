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

  // 유저 이름으로 유저를 조회하고, 그 유저가 쓴 팁을 조회 후, 팁에 관련된 이미지들을 반환
  async execute(nickname: string): Promise<GetImageListDTO[] | null> {
    const user: GetUserDto | null = await this.userRepository.getUserByName(
      nickname
    );

    if (!user) {
      throw new Error("User not found");
    }

    const tips = await this.tipRepository.getTipsByUserId(user.id);

    const images: GetImageListDTO[] = [];

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
            nickname: user.nickname, // 작성자 이름 (닉네임)
            spotName: spot.name, // 명소 이름
          };
          images.push(imageDTO);
        }
      }
    }

    if (images.length > 0) {
      return images;
    }

    // 이미지가 없다면 null 반환
    return null;
  }
}
