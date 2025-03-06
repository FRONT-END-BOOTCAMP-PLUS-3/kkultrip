export interface ImageRepository {
  CreateImages(tipId: number, imageFiles: File[]): Promise<void>;
  getImagesByTipId(tipId: number): Promise<string[]>;
  deleteImagesByTipId(tipId: number): Promise<void>;
}
