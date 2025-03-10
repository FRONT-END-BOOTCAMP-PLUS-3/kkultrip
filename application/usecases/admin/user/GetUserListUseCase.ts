import UserRepository from "@/domain/repositories/UserRepository";
import { GetUserListDto } from "./dto/GetUserListDto";

export default class GetUserListUseCase {
  constructor(private userRepository: UserRepository) {}

  async execute(page: number = 1): Promise<{
    users: GetUserListDto[];
    totalCount: number;
    totalPages: number;
    hasPreviousPage: boolean;
    hasNextPage: boolean;
    pages: number[];
  }> {
    const limit = 10; // 한 페이지당 10개씩
    const offset = (page - 1) * limit;

    // 전체 사용자 목록을 가져옴
    const users = await this.userRepository.getAllUsers();
    const totalCount = users!.length; // 전체 사용자 수

    // 페이지에 맞게 사용자 목록을 자름
    const paginatedUsers = users!.slice(offset, offset + limit);

    const totalPages = Math.ceil(totalCount / limit);
    const hasPreviousPage = page > 1;
    const hasNextPage = page < totalPages;

    // 사용자 정보와 페이지 정보 반환
    const usersWithPagination = {
      users: paginatedUsers.map((user) => ({
        id: user.id,
        nickname: user.nickname,
        img: user.img,
        isAdmin: user.isAdmin,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt,
        email: user.email,
      })),
      totalCount,
      totalPages,
      hasPreviousPage,
      hasNextPage,
      pages: Array.from({ length: totalPages }, (_, i) => i + 1),
    };

    return usersWithPagination;
  }
}
