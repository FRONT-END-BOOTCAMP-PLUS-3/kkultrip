import { TipReactionDto } from "./TipReactionDto";

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
}
