import UserRepository from "@/domain/repositories/UserRepository";
import { GetUserListDto } from "./dto/GetUserListDto";

export class GetUserByNameUseCase {
  private userRepository: UserRepository;

  constructor(userRepository: UserRepository) {
    this.userRepository = userRepository;
  }

  async execute(nickname: string): Promise<GetUserListDto[]> {
    try {
      // nickname으로 사용자 조회
      const users = await this.userRepository.getUsersByPartialName(nickname);

      // 사용자가 존재하지 않으면 빈 배열 반환
      if (!users) {
        return [];
      }
      return users;
    } catch (error) {
      throw new Error("Error retrieving user by nickname");
    }
  }
}
