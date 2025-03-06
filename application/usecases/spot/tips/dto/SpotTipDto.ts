import { TipReactionDto } from "./TipReactionDto";
import { TipImageDto } from "./TipImageDto";
export interface SpotTipDto {
    id: number;
    userId: string;
    userName: string;
    spotName: string;
    profileImage: string;
    price: string;
    description: string;
    tipReaction: TipReactionDto[];
    createdAt: string;
    tipImages: TipImageDto[];
}
