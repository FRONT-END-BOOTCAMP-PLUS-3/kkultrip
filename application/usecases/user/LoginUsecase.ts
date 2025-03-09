import UserRepository from "@/domain/repositories/UserRepository";
import { createJWT } from "@/utils/jwt";
import bcrypt from "bcrypt";
import { LoggedInUserDto } from "./dto/LoggedInUserDto";
import { LoginUserDto } from "./dto/LoginUserDto";

export class LoginUsecase {
  constructor(private userRepository: UserRepository) {}

  async execute({ email, password }: LoginUserDto): Promise<LoggedInUserDto> {
    const user = await this.userRepository.findByEmail(email);
    if (!user) throw new Error("userNotFound");

    const isComparePassword = await bcrypt.compare(password, user.password);
    if (!isComparePassword) throw new Error("isNotComparePassword");

    const userId = user.id;
    const isAdmin = user.isAdmin;
    const img = user.img;
    const nickname = user.nickname;

    const response = {
      token: await createJWT(userId, isAdmin),
      isAdmin,
      img,
      nickname,
    };

    return response;
  }
}
