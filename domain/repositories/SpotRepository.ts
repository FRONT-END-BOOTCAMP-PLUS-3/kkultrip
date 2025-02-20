export default interface SpotRepository {
  createSpot(
    name: string,
    description: string,
    latitude: number,
    longitude: number
  ): Promise<void>;
}
