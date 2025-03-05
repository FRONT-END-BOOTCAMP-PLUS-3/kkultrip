export interface ImageRepository {
  CreateImages(tipId: number, imageFiles: File[]): Promise<string[]>;
  getImagesByTipId(tipId: number): Promise<string[]>;
  deleteImagesByTipId(tipId: number): Promise<void>;
}
