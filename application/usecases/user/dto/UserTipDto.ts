import { TipImageDto } from "./TipImageDto";
import { TipReactionDto } from "./TipReactionDto";

export interface UserTipDto {
  id: number;
  spotName: string;
  spotImage: string;
  price: string;
  description: string;
  tipReaction: TipReactionDto;
  tipImages: TipImageDto[];
  waitingTime: number;
  category: string;
  spotId: number;
}
