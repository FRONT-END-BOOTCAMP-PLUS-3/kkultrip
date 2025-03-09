import ReactionRepository from "@/domain/repositories/ReactionRepository";
import SpotRepository from "@/domain/repositories/SpotRepository";
import TipRepository from "@/domain/repositories/TipRepository";
import UserRepository from "@/domain/repositories/UserRepository";
import { Reaction, Spot, User } from "@prisma/client";
import { SpotTipDto } from "./dto/SpotTipDto";
import { TipReactionDto } from "./dto/TipReactionDto";
import { ImageRepository } from "@/domain/repositories/ImageRepository";
import { Image } from "@prisma/client";
import { TipImageDto } from "./dto/TipImageDto";
export class GetSpotTipUsecase {
  constructor(
    private tipRepository: TipRepository,
    private userRepository: UserRepository,
    private spotRepository: SpotRepository,
    private reactionRepository: ReactionRepository,
    private imageRepository: ImageRepository
  ) {}

  async execute(
    spotId: number,
    orderBy: "createdAt" | "reactionCount"
  ): Promise<SpotTipDto[]> {
    const tips = await this.tipRepository.getTipsBySpotId(spotId, orderBy);

    const spotTipList: SpotTipDto[] = await Promise.all(
      tips.map(async (tip) => {
        const user: User | null = await this.userRepository.getUserById(
          tip.userId
        );
        if (!user) {
          throw new Error("유저 정보를 찾을 수 없습니다.");
        }

        const spot: Spot | null = await this.spotRepository.getSpotById(
          tip.spotId
        );
        if (!spot) {
          throw new Error("장소 정보를 찾을 수 없습니다.");
        }

        const tipReaction: Reaction[] | null =
          await this.reactionRepository.getReactionsByTipId(tip.id);

        const tipReactionList: TipReactionDto[] = tipReaction?.map(
          (reaction) => {
            return {
              userId: reaction.userId,
              spotId: tip.spotId,
              tipId: tip.id,
              type: reaction.type,
            };
          }
        );

        const tipImages: Image[] | null =
          await this.imageRepository.getImageByTipId(tip.id);

        if (!tipImages) {
          throw new Error("이미지 정보를 찾을 수 없습니다.");
        }

        const tipImageList: TipImageDto[] = tipImages?.map((image) => {
          return {
            id: image.id,
            tipId: image.tipId,
            path: image.path ?? "",
          };
        });

        return {
          id: tip.id,
          userId: user.id,
          userName: user.nickname,
          spotName: spot.name,
          profileImage: user.img,
          price: tip.price.toLocaleString(),
          description: tip.description,
          tipReaction: tipReactionList,
          tipImages: tipImageList,
          createdAt: tip.createdAt.toLocaleDateString(),
          waitingTime: tip.waitingTime,
          spotId: tip.spotId,
        };
      })
    );

    return spotTipList;
  }
}
