export interface GetTipDto {
  id: number;
  spotId: number;
  userId: string;
  description: string;
  price: number;
  reportCnt: number;
  waitingTime: number;
  createdAt: string;
  updatedAt: string;
}
