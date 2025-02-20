export interface Time {
  id: number;
  spotId: number;
  open: string;
  close: string;
  day: string;
  closeDay: string | null;
  createdAt: Date;
  updatedAt: Date;
}
