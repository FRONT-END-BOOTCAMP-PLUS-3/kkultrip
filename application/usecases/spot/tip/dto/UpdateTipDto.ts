export interface UpdateTipDto {
  tipId: number;
  description: string;
  price: number;
  waitingTime: number;
  images: File[];
}
