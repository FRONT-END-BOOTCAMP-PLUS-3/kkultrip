export default interface DocentRepository {
  createDocent(spotId: number, description: string): Promise<void>;
}
