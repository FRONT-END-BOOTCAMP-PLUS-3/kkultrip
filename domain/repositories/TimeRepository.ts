import { Time } from "@prisma/client";

export interface TimeRepository {
  getTodayHours(spotId: number): Promise<string | null>;
  createTime(time: Time): Promise<Time>;
}
