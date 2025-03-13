import UserRepository from "@/domain/repositories/UserRepository";
import { prisma } from "@/lib/prisma";
import { User } from "@prisma/client";

export class PgUserRepository implements UserRepository {
  // 회원가입
  async createUser(user: User): Promise<void> {
    try {
      await prisma.user.create({
        data: {
          nickname: user.nickname,
          email: user.email,
          password: user.password,
        },
      });
    } finally {
      await prisma.$disconnect();
    }
  }

  // email로 유저 찾기
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

  // 닉네임으로 유저 찾기
  async findByNickname(nickname: string): Promise<User | null> {
    try {
      return await prisma.user.findUnique({
        where: { nickname },
      });
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
    } finally {
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

  // 사용자 이름으로 정보 찾기
  async getUserByName(nickname: string): Promise<User | null> {
    try {
      const user = await prisma.user.findUnique({
        where: { nickname },
      });
      return user ?? null;
    } finally {
      await prisma.$disconnect();
    }
  }

  async getUsersByPartialName(name: string): Promise<User[] | null> {
    try {
      return await prisma.user.findMany({
        where: {
          nickname: {
            contains: name,
            mode: "insensitive",
          },
        },
      });
    } catch (error) {
      console.log("❌ getUsersByPartialName 오류 발생:", error);
      throw new Error("유저 데이터를 가져오지 못했습니다.");
    } finally {
      await prisma.$disconnect();
    }
  }

  // 닉네임으로 유저 정보 찾기
  async getUserIdByNickname(nickname: string): Promise<{ id: string } | null> {
    try {
      const userId = await prisma.user.findUnique({
        where: { nickname },
        select: { id: true },
      });

      return userId ?? null;
    } finally {
      await prisma.$disconnect();
    }
  }

  // 유저 정보 업데이트(닉네임, 프로필)
  async updateUser(
    id: string,
    nickname: string,
    img: string
  ): Promise<User | null> {
    try {
      const updatedUser = await prisma.user.update({
        where: { id },
        data: { nickname, img },
      });
      return updatedUser ?? null;
    } finally {
      await prisma.$disconnect();
    }
  }
}
