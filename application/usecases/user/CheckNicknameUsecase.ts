import UserRepository from "@/domain/repositories/UserRepository";

export default class CheckNicknameUseCase {
  constructor(private userRepository: UserRepository) {}

  async execute(nickname: string): Promise<boolean> {
    if (!nickname) {
      throw new Error("닉네임을 입력하세요.");
    }

    const existingUser = await this.userRepository.findByNickname(nickname);
    return existingUser === null;
  }
}
