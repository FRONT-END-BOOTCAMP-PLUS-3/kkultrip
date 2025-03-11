import TipRepository from "@/domain/repositories/TipRepository";
import { TipListDto } from "./dto/TipListDto";
import SpotRepository from "@/domain/repositories/SpotRepository";
import UserRepository from "@/domain/repositories/UserRepository";

export class GetTipListUseCase {
  constructor(
    private tipRepository: TipRepository,
    private spotRepository: SpotRepository,
    private userRepository: UserRepository
  ) {}

  async execute(page: number = 1): Promise<TipListDto> {
    const limit = 10; // 한 페이지당 10개씩
    const offset = (page - 1) * limit;

    // 전체 팁 목록을 가져옴
    const tips = await this.tipRepository.getAllTips();
    const totalCount = tips.length; // 전체 팁 수

    // 페이지에 맞게 팁을 자름
    const paginatedTips = tips.slice(offset, offset + limit);

    const totalPages = Math.ceil(totalCount / limit);
    const hasPreviousPage = page > 1;
    const hasNextPage = page < totalPages;

    // 팁과 관련된 사용자 정보 가져오기
    const tipsWithPagination: TipListDto = {
      tips: await Promise.all(
        paginatedTips.map(async (tip) => {
          // 명소를 가져옴
          const spot = await this.spotRepository.getSpotById(tip.spotId);
          // 사용자를 가져옴
          const user = await this.userRepository.getUserById(tip.userId);

          return {
            id: tip.id,
            spotId: spot!.id,
            spotName: spot!.name,
            nickname: user!.nickname,
            userId: tip.userId,
            description: tip.description,
            price: tip.price,
            reportCnt: tip.reportCnt,
            waitingTime: tip.waitingTime,
            createdAt: tip.createdAt,
            updatedAt: tip.updatedAt,
          };
        })
      ),
      totalCount,
      totalPages,
      hasPreviousPage,
      hasNextPage,
      pages: Array.from({ length: totalPages }, (_, i) => i + 1),
    };

    return tipsWithPagination;
  }
}
