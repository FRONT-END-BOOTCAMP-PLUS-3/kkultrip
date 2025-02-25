import { Tip } from "@prisma/client";

export default interface TipRepository {
  createTip(spotId: number): Promise<void>;

  getAllTips(): Promise<Tip[]>;
}
