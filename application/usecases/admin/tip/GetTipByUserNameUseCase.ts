import { PgTipRepository } from "@/infrastructure/repositories/PgTipRepository";
import PgSpotRepository from "@/infrastructure/repositories/PgSpotRepository";
import { GetTipListDto } from "./dto/GetTipListDto";
import { PgUserRepository } from "@/infrastructure/repositories/PgUserRepository";

export default class GetTipByUserNameUseCase {
  private tipRepository: PgTipRepository;
  private spotRepository: PgSpotRepository;
  private userRepository: PgUserRepository;

  constructor(
    tipRepository: PgTipRepository,
    spotRepository: PgSpotRepository,
    userRepository: PgUserRepository
  ) {
    this.tipRepository = tipRepository;
    this.spotRepository = spotRepository;
    this.userRepository = userRepository;
  }

  async execute(
    userName: string,
    orderBy: "createdAt" | "reactionCount"
  ): Promise<GetTipListDto[]> {
    try {
      // 사용자 이름으로 사용자 정보를 가져옴
      const user = await this.userRepository.getUserByName(userName);

      if (!user) {
        throw new Error("사용자를 찾을 수 없습니다.");
      }

      // 사용자의 팁들을 가져옴
      const tips = await this.tipRepository.getTipsByUserId(user.id);

      // 팁에 대한 장소 정보를 추가
      const tipsWithSpotInfo = await Promise.all(
        tips.map(async (tip) => {
          const spot = await this.spotRepository.getSpotById(tip.spotId);
          return {
            id: tip.id,
            spotId: tip.spotId,
            spotName: spot!.name, // spotName을 장소에서 가져옵니다.
            nickname: user.nickname, // 유저의 nickname을 가져옵니다.
            description: tip.description,
            price: tip.price,
            waitingTime: tip.waitingTime,
            reportCnt: tip.reportCnt,
            createdAt: tip.createdAt,
            updatedAt: tip.updatedAt,
          };
        })
      );

      return tipsWithSpotInfo;
    } catch (error) {
      console.log("❌ GetTipByUserNameUseCase 오류 발생:", error);
      throw new Error("사용자 팁 데이터를 가져오는 데 실패했습니다.");
    }
  }
}
