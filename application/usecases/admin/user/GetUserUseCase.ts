import UserRepository from "@/domain/repositories/UserRepository";
import { GetUserDto } from "./dto/GetUserDto";

export default class GetUserUseCase {
  constructor(private userRepository: UserRepository) {}

  async execute(id: string): Promise<GetUserDto | null> {
    const user = await this.userRepository.getUserById(id);
    return user;
  }
}
