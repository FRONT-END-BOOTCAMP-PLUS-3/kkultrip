import { Tip } from "@prisma/client";

export default interface TipRepository {
  countBySpot(spotId: number): Promise<number>;
  createTip(spotId: number): Promise<void>;
  getTipsBySpotId(spotId: number): Promise<Tip[]>
  getAllTips(): Promise<Tip[]>;
}
