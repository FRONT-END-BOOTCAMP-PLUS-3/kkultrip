import SpotRepository from "@/domain/repositories/SpotRepository";
import TipRepository from "@/domain/repositories/TipRepository";
import UserRepository from "@/domain/repositories/UserRepository";
import { Reaction, Spot, User } from "@prisma/client";
import { SpotTipDto } from "./dto/SpotTipDto";
import ReactionRepository from "@/domain/repositories/ReactionRepository";
import { TipReactionDto } from "./dto/TipReactionDto";

export class GetSpotTipUsecase {
    constructor(
        private tipRepository: TipRepository,
        private userRepository: UserRepository,
        private spotRepository: SpotRepository,
        private reactionRepository: ReactionRepository
    ) {}

    async execute(spotId: number): Promise<SpotTipDto[]> {
        const tips = await this.tipRepository.getTipsBySpotId(spotId);

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
                            tipId: tip.id,
                            type: reaction.type,
                        };
                    }
                );
                return {
                    id: tip.id,
                    userName: user.nickname,
                    spotName: spot.name,
                    profileImage: user.img,
                    price: tip.price.toLocaleString(),
                    description: tip.description,
                    tipReaction: tipReactionList,
                };
            })
        );

        return spotTipList;
    }
}
