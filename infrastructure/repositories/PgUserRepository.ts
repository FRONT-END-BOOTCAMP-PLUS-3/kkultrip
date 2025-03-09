import UserRepository from "@/domain/repositories/UserRepository";
import { PrismaClient, User } from "@prisma/client";

const prisma = new PrismaClient();

export class PgUserRepository implements UserRepository {
  // 회원가입
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

  // email로 내 정보 찾기
  async findByEmail(email: string): Promise<User | null> {
    try {
      const user = await prisma.user.findUnique({
        where: { email },
      });
      return user ?? null;
    } finally {
      await prisma.$disconnect();
    }
  }

  // id로 내 정보 찾기
  async getUserById(id: string): Promise<User | null> {
    try {
      const user = await prisma.user.findUnique({
        where: { id },
      });
      return user ?? null;
    } finally {
      await prisma.$disconnect();
    }
  }

  // 모든 사용자 정보 가져오기
  async getAllUsers(): Promise<User[]> {
    try {
      return await prisma.user.findMany();
    } finally {
      await prisma.$disconnect();
    }
  }

  // 권한 변경 (관리자/유저)
  async updateUserRole(id: string, isAdmin: boolean): Promise<void> {
    try {
      await prisma.user.update({
        where: { id },
        data: { isAdmin },
      });
    }finally {
      await prisma.$disconnect();
    }
  }
  // 회원탈퇴
  async deleteUser(id: string): Promise<void> {
    try {
      await prisma.user.delete({
        where: { id },
      });
    } finally {
      await prisma.$disconnect();
    }
  }
}
