export interface UpdateTipDto {
  tipId: number;
  description: string;
  price: number;
  waitingTime: number;
  newImageFiles: File[];
  existingImagePaths: string[];
}
