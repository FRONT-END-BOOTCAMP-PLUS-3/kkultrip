export interface CreateTipDto {
  spotId: number;
  userId: string;
  description: string;
  price: number;
  waitingTime: number;
  images: File[];
}
