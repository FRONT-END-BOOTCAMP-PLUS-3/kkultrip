export default interface BookmarkRepository {
  createBookmark(spotId: number, userId: string): Promise<void>;
}
