export default interface BookmarkRepository {
    countBySpot(spotId: number): Promise<number>;
    checkBookmark(spotId: number, userId: string): Promise<boolean>;
    createBookmark(spotId: number, userId: string): Promise<void>;
    deleteBookmark(spotId: number, userId: string): Promise<void>;
}
