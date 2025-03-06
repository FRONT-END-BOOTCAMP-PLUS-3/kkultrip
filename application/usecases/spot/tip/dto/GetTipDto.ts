export interface GetTipDto {
  id: number;
  spotId: number;
  userId: string;
  description: string;
  price: number;
  waitingTime: number;
  reportCnt: number;
  createdAt: Date;
  updatedAt: Date;
  images: string[];
}
