import ReactionRepository from "@/domain/repositories/ReactionRepository";
import TipRepository from "@/domain/repositories/TipRepository";
import SpotRepository from "@/domain/repositories/SpotRepository";
import { GetMyTipDto } from "./dto/GetMyTipDto";
import { GetTipReactionDto } from "./dto/GetTipReactionDto";
import { ImageRepository } from "@/domain/repositories/ImageRepository";
import { GetTipImageDto } from "./dto/GetTipImageDto";

export class GetMyTipsUsecase {
  constructor(
    private tipRepository: TipRepository,
    private reactionRepository: ReactionRepository,
    private imageRepository: ImageRepository,
    private spotRepository: SpotRepository
  ) {}

  async execute(userId: string): Promise<GetMyTipDto[]> {
    const tips = await this.tipRepository.getTipsByUserId(userId);

    const userTipList: GetMyTipDto[] = await Promise.all(
      tips.map(async (tip) => {
        const spot = await this.spotRepository.getSpotById(tip.spotId);
        if (!spot) {
          throw new Error("장소 정보를 찾을 수 없습니다.");
        }

        const tipReaction = await this.reactionRepository.getReactionsByTipId(
          tip.id
        );

        const reactionTypeMap: Record<number, keyof GetTipReactionDto> = {
          1: "useful",
          2: "wantToGo",
          3: "disappointing",
          4: "interesting",
        };

        const tipReactionList: GetTipReactionDto = {
          useful: 0,
          wantToGo: 0,
          disappointing: 0,
          interesting: 0,
        };

        tipReaction?.forEach((reaction) => {
          const reactionKey = reactionTypeMap[reaction.type];
          if (reactionKey) {
            tipReactionList[reactionKey] += 1;
          }
        });

        const tipImages = await this.imageRepository.getImageByTipId(tip.id);

        if (!tipImages) {
          throw new Error("이미지 정보를 찾을 수 없습니다.");
        }

        const tipImageList: GetTipImageDto[] = tipImages?.map((image) => {
          return {
            path: image.path,
          };
        });

        return {
          id: tip.id,
          spotName: spot.name,
          spotImage: spot.img,
          price: tip.price.toLocaleString(),
          description: tip.description,
          tipReaction: tipReactionList,
          tipImages: tipImageList,
          waitingTime: tip.waitingTime,
          category: spot.category,
          spotId: tip.spotId,
        };
      })
    );

    return userTipList;
  }
}
