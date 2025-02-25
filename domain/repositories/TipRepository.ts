export default interface TipRepository {
  countBySpot(spotId: number): Promise<number>;
}
