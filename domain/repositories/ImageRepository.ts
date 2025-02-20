export default interface ImageRepository {
  createImage(spotId: number, userId: string, imageUrl: string): Promise<void>;
}
