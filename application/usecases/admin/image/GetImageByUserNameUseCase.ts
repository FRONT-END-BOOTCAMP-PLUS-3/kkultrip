import { PgUserRepository } from "@/infrastructure/repositories/PgUserRepository";
import { PgTipRepository } from "@/infrastructure/repositories/PgTipRepository";
import { PgImageRepository } from "@/infrastructure/repositories/PgImageRepository";
import { GetUserDto } from "../user/dto/GetUserDto";
import { GetImageListDTO } from "./dto/GetImageListDto";

export class GetImageByUserNameUseCase {
  private userRepository: PgUserRepository;
  private tipRepository: PgTipRepository;
  private imageRepository: PgImageRepository;

  constructor(
    userRepository: PgUserRepository,
    tipRepository: PgTipRepository,
    imageRepository: PgImageRepository
  ) {
    this.userRepository = userRepository;
    this.tipRepository = tipRepository;
    this.imageRepository = imageRepository;
  }

  // 유저 이름으로 유저를 조회하고, 그 유저가 쓴 팁을 조회 후, 팁에 관련된 이미지들을 반환
  async execute(userName: string): Promise<GetImageListDTO[] | null> {
    const user: GetUserDto | null = await this.userRepository.getUserByName(
      userName
    );

    if (!user) {
      throw new Error("User not found");
    }

    const tips = await this.tipRepository.getTipsByUserId(user.id);

    const images: GetImageListDTO[] = [];

    for (const tip of tips) {
      // 해당 팁의 이미지가 있는지 확인
      const imagesForTip = await this.imageRepository.getImageByTipId(tip.id);

      imagesForTip.forEach((image) => {
        if (image.path) {
          const imageDTO: GetImageListDTO = {
            id: image.id,
            tipId: image.tipId,
            path: image.path,
          };
          images.push(imageDTO);
        }
      });
    }

    if (images.length > 0) {
      return images;
    }

    // 이미지가 없다면 null 반환
    return null;
  }
}
