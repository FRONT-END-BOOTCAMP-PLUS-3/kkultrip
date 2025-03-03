import { PrismaClient, User } from "@prisma/client";
import { UserRepository } from "@/domain/repositories/UserRepository";
import { CreateUserDto } from "@/application/usecases/user/dto/CreateUserDto";

const prisma = new PrismaClient();

export class PgUserRepository implements UserRepository {
  async createUser(user: CreateUserDto): Promise<User> {
    return await prisma.user.create({
      data: {
        img: user.img,
        nickname: user.nickname,
        email: user.email,
        password: user.password,
      },
    });
  }
}
