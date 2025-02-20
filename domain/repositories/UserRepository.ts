export default interface UserRepository {
  createUser(spotId: number): Promise<void>;
}
