import { TipReactionDto } from "./TipReactionDto";

export interface SpotTipDto {
    id: number;
    userName: string;
    spotName: string;
    profileImage: string;
    price: string;
    description: string;
    tipReaction: TipReactionDto[];
}
