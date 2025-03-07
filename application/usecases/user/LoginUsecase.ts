import UserRepository from "@/domain/repositories/UserRepository";
import { LoginUserDto } from "./dto/LoginUserDto";
import bcrypt from "bcrypt";
import { createJWT } from "@/utils/jwt";

export class LoginUsecase {
  constructor(private userRepository: UserRepository) {}

  async execute({
    email,
    password,
  }: LoginUserDto): Promise<{ token: string; isAdmin: boolean }> {
    const user = await this.userRepository.findByEmail(email);
    if (!user) throw new Error("User not found");

    const isComparePassword = await bcrypt.compare(password, user.password);
    if (!isComparePassword) throw new Error("isNotComparePassword");

    const userId = user.id;
    const isAdmin = user.isAdmin;
    const response = {
      token: await createJWT(userId, isAdmin),
      isAdmin: isAdmin,
    };

    return response;
  }
}
