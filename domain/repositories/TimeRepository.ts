export default interface TimeRepository {
  getTodayHours(spotId: number): Promise<string | null>;
}
