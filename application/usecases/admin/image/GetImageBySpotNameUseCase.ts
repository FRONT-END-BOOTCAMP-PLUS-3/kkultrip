import PgSpotRepository from "@/infrastructure/repositories/PgSpotRepository";
import { PgTipRepository } from "@/infrastructure/repositories/PgTipRepository";
import { PgImageRepository } from "@/infrastructure/repositories/PgImageRepository";
import { PgUserRepository } from "@/infrastructure/repositories/PgUserRepository";
import { GetImageListDTO } from "./dto/GetImageListDto";
import { GetUserDto } from "../user/dto/GetUserDto";

export class GetImageBySpotNameUseCase {
  private spotRepository: PgSpotRepository;
  private tipRepository: PgTipRepository;
  private imageRepository: PgImageRepository;
  private userRepository: PgUserRepository;

  constructor(
    spotRepository: PgSpotRepository,
    tipRepository: PgTipRepository,
    imageRepository: PgImageRepository,
    userRepository: PgUserRepository
  ) {
    this.spotRepository = spotRepository;
    this.tipRepository = tipRepository;
    this.imageRepository = imageRepository;
    this.userRepository = userRepository;
  }

  // 스팟 이름으로 명소를 조회하고, 해당 명소에 작성된 팁들과 관련된 이미지 및 작성자 이름, 명소 이름을 반환
  async execute(spotName: string): Promise<GetImageListDTO[] | null> {
    // 1. 스팟 이름으로 명소 조회
    const spot = await this.spotRepository.getSpotByName(spotName);

    if (!spot) {
      throw new Error("Spot not found");
    }

    // 2. 해당 명소에 작성된 팁들을 조회
    const tips = await this.tipRepository.getTipsBySpotId(spot.id, "createdAt");

    const images: GetImageListDTO[] = [];

    for (const tip of tips) {
      // 3. 팁에 관련된 이미지 조회
      const imagesForTip = await this.imageRepository.getImageByTipId(tip.id);

      // 4. 각 이미지에 대해 작성자 정보 및 명소 이름 포함하여 반환할 DTO 생성
      for (const image of imagesForTip) {
        if (image.path) {
          // 작성자 정보 조회
          const user: GetUserDto | null = await this.userRepository.getUserById(
            tip.userId
          );
          if (!user) continue;

          const imageDTO: GetImageListDTO = {
            id: image.id,
            tipId: image.tipId,
            path: image.path,
            createdAt: image.createdAt,
            nickname: user.nickname, // 작성자 닉네임
            spotName: spot.name, // 명소 이름
          };

          images.push(imageDTO);
        }
      }
    }

    // 이미지가 있다면 반환, 없다면 null
    return images.length > 0 ? images : null;
  }
}
