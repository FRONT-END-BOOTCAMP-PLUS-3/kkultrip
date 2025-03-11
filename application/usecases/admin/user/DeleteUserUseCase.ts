import UserRepository from "@/domain/repositories/UserRepository";

export default class DeleteUserUsecase {
  constructor(private userRepository: UserRepository) {}

  async execute(id: string): Promise<void> {
    await this.userRepository.deleteUser(id);
  }
}
