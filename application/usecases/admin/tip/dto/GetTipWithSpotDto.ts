export interface GetTipWithSpotDto {
  id: number;
  spotId: number;
  spotName: string;
  userId: string;
  description: string;
  price: number;
  reportCnt: number;
  waitingTime: number;
  createdAt: Date;
  updatedAt: Date;
  images: string[];
}
