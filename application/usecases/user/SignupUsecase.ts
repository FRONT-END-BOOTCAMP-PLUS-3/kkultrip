import { UserRepository } from "@/domain/repositories/UserRepository";
import bcrypt from "bcrypt";
import { CreateUserDto } from "./dto/CreateUserDto";

export default class SignupUsecase {
  constructor(private repository: UserRepository) {}

  async execute(data: CreateUserDto): Promise<void> {
    const { img, nickname, email, password } = data;
    const hashedPassword = await bcrypt.hash(password, 10);

    const user: CreateUserDto = {
      img: img,
      nickname: nickname,
      email: email,
      password: hashedPassword,
    };

    await this.repository.createUser({
      ...user,
      id: "",
      isAdmin: false,
      kakaoId: 0,
      createdAt: new Date(),
      updatedAt: new Date(),
    });
  }
}
