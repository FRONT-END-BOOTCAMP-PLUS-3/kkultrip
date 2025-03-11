import UserRepository from "@/domain/repositories/UserRepository";

export class UpdateUserUsecase {
  constructor(private userRepository: UserRepository) {}

  async execute(userId: string, nickname: string, img: string) {
    return await this.userRepository.updateUser(userId, nickname, img);
  }
}
