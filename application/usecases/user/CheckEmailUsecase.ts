import UserRepository from "@/domain/repositories/UserRepository";

export default class CheckEmailUseCase {
  constructor(private userRepository: UserRepository) {}

  async execute(email: string): Promise<boolean> {
    if (!email) {
      throw new Error("이메일을 입력하세요.");
    }

    const existingUser = await this.userRepository.findByEmail(email);
    return existingUser === null;
  }
}
