import { Tip } from "@prisma/client";

export default interface TipRepository {
    countBySpot(spotId: number): Promise<number>;
    createTip(spotId: number): Promise<void>;
    getTipsBySpotId(
        spotId: number,
        orderBy: "createdAt" | "reactionCount"
    ): Promise<Tip[]>;
    getAllTips(): Promise<Tip[]>;
    updateTipReportCount(tipId: number): Promise<void>;
    deleteTip(tipId: number): Promise<void>;
}
