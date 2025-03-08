export interface GetTipListDto {
  id: number;
  spotId: number;
  spotName: string;
  userId: string;
  description: string;
  price: number;
  waitingTime: number;
  reportCnt: number;
  createdAt: Date;
  updatedAt: Date;
}
