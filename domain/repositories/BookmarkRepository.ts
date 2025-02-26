export default interface BookmarkRepository {
  countBySpot(spotId: number): Promise<number>;
}
