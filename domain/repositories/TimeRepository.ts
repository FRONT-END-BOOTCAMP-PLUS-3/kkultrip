import { Time } from "@prisma/client";

export default interface TimeRepository {
    getTodayHours(spotId: number): Promise<string | null>;

    createTime(time: Time): Promise<Time>;
    updateTime(id: number, time: Time): Promise<Time>;

    getTodayHours(spotId: number): Promise<string | null>;
    getTimeBySpotId(spotId: number): Promise<Time[] | null>;
}
