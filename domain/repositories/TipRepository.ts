import { Tip } from "@prisma/client";

export default interface TipRepository {
  countBySpot(spotId: number): Promise<number>;
  createTip(spotId: number): Promise<void>;

  getAllTips(): Promise<Tip[]>;
}
