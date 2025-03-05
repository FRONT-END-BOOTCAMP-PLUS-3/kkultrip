export interface ImageRepository {
  uploadImages(tipId: number, imagePaths: string[]): Promise<void>;
  getImagesByTipId(tipId: number): Promise<string[]>;
  deleteImagesByTipId(tipId: number): Promise<void>;
}
