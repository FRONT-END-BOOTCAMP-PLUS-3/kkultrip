export default interface ReactionRepository {
  createReaction(spotId: number, userId: string): Promise<void>;
}
