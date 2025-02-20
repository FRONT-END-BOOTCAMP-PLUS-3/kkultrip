export default interface TipRepository {
  createTip(spotId: number): Promise<void>;
}
