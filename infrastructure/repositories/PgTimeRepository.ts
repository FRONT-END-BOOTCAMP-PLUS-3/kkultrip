import TimeRepository from "@/domain/repositories/TimeRepository";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export class PgTimeRepository implements TimeRepository {
  async getTodayHours(spotId: number): Promise<string | null> {
    // 현재 요일 가져오기 (0: 일요일, 6: 토요일)
    const today = new Date().getDay();
    const days = ["일", "월", "화", "수", "목", "금", "토"];
    const todayStr = days[today];

    // 오늘의 영업시간 조회
    const timeInfo = await prisma.time.findFirst({
      where: {
        spotId,
        day: todayStr,
      },
    });

    // 해당 요일의 정보가 없으면 null 반환
    if (!timeInfo) return null;

    // 휴무일인지 확인
    if (timeInfo.closeDay === true) return "휴무";

    if (timeInfo.all_hours === true) return "24시간";

    // 영업시간 반환 (예: "09:00 ~ 18:00")
    return `${timeInfo.open} ~ ${timeInfo.close}`;
  }
}
