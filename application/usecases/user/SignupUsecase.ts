import { UserRepository } from "@/domain/repositories/UserRepository";
import { User } from "@prisma/client";
import { CreateUserDto } from "./dto/CreateUserDto";

export default class SignupUsecase {
  constructor(private repository: UserRepository) {}

  async execute(data: CreateUserDto): Promise<User> {
    const { img, nickname, email, password } = data;

    const user: CreateUserDto = {
      img: img,
      nickname: nickname,
      email: email,
      password: password,
    };

    const newUser = await this.repository.createUser(user);

    return newUser;
  }
}
