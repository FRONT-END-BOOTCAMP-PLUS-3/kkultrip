import { Tip } from "@prisma/client";

export default interface TipRepository {
  createTip(
    spotId: number,
    userId: string,
    description: string,
    price: number,
    waitingTime: number
  ): Promise<Tip>;
  getTipById(tipId: number): Promise<Tip | null>;
  updateTip(
    tipId: number,
    description: string,
    price: number,
    waitingTime: number
  ): Promise<Tip | null>;
  getAllTips(): Promise<Tip[]>;
  countBySpot(spotId: number): Promise<number>;
  countBySpot(spotId: number): Promise<number>;
  getTipsBySpotId(
    spotId: number,
    orderBy: "createdAt" | "reactionCount"
  ): Promise<Tip[]>;
  getAllTips(): Promise<Tip[]>;
  updateTipReportCount(tipId: number): Promise<void>;
    deleteTip(tipId: number): Promise<void>;
}
