export default interface TimeRepository {
  createTime(spotId: number): Promise<void>;
}
