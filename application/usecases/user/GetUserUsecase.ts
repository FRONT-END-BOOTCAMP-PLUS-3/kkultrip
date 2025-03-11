import UserRepository from "@/domain/repositories/UserRepository";

export class GetUserUsecase {
  constructor(private userRepository: UserRepository) {}

  async execute(userId: string) {
    return await this.userRepository.getUserById(userId);
  }
}
