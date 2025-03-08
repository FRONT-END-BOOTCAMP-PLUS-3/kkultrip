import { GetTipImageDto } from "./GetTipImageDto";
import { GetTipReactionDto } from "./GetTipReactionDto";

export interface GetReactedTipDto {
  id: number;
  spotName: string;
  spotImage: string;
  price: string;
  description: string;
  tipReaction: GetTipReactionDto;
  tipImages: GetTipImageDto[];
  waitingTime: number;
  category: string;
  spotId: number;
}
