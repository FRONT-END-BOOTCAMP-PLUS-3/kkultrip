import UserRepository from "@/domain/repositories/UserRepository";
import { GetUserListDto } from "./dto/GetUserListDto";
import { User } from "@prisma/client";

export default class GetUserListUseCase {
  constructor(private userRepository: UserRepository) {}

  async execute(): Promise<GetUserListDto[]> {
    const users = await this.userRepository.getAllUsers();

    if (!users) {
      return [];
    }

    const userList: GetUserListDto[] = users.map((user) => ({
      id: user.id,
      nickname: user.nickname,
      img: user.img,
      isAdmin: user.isAdmin,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
      email: user.email,
    }));

    return userList;
  }
}
