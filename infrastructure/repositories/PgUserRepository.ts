import { UserRepository } from "@/domain/repositories/UserRepository";
import { PrismaClient, User } from "@prisma/client";

const prisma = new PrismaClient();

export class PgUserRepository implements UserRepository {
  async createUser(user: User): Promise<void> {
    try {
      await prisma.user.create({
        data: {
          img: user.img,
          nickname: user.nickname,
          email: user.email,
          password: user.password,
        },
      });
    } finally {
      await prisma.$disconnect();
    }
  }
}
