import UserRepository from "@/domain/repositories/UserRepository";
import { GetUserListDto } from "./dto/GetUserListDto"; // DTO 경로 맞게 수정해주세요

export class GetUserByNameUseCase {
  private userRepository: UserRepository;

  constructor(userRepository: UserRepository) {
    this.userRepository = userRepository;
  }

  async execute(nickname: string): Promise<GetUserListDto[]> {
    try {
      // nickname으로 사용자 조회
      const user = await this.userRepository.getUserByName(nickname);

      // 사용자가 존재하지 않으면 빈 배열 반환
      if (!user) {
        return [];
      }

      // DTO 형태로 변환하여 배열로 반환
      const userList: GetUserListDto[] = [
        {
          id: user.id,
          isAdmin: user.isAdmin,
          nickname: user.nickname,
          createdAt: user.createdAt,
          updatedAt: user.updatedAt,
          email: user.email,
        },
      ];

      return userList;
    } catch (error) {
      throw new Error("Error retrieving user by nickname");
    }
  }
}
