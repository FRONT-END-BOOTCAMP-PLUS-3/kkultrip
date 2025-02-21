export interface Tip {
  id: number;
  spotId: number;
  userId: string;
  description: string | null;
  price: number;
  waitingTime: number;
  reportCnt: number;
  createdAt: Date;
  updatedAt: Date;
}
