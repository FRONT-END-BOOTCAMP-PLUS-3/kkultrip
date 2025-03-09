import UserRepository from "@/domain/repositories/UserRepository";
import { UpdateUserRoleDto } from "./dto/UpdateUserRoleDto";

export class UpdateUserRoleUseCase {
  private userRepository: UserRepository;

  constructor(userRepository: UserRepository) {
    this.userRepository = userRepository;
  }

  async execute(input: UpdateUserRoleDto): Promise<void> {
    const { id, isAdmin } = input;

    await this.userRepository.updateUserRole(id, isAdmin);
  }
}
