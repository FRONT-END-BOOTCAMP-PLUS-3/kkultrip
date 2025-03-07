import { prisma } from "@/lib/prisma";
import UserRepository from "@/domain/repositories/UserRepository";
import { User } from "@prisma/client";

export default class PgUserRepository implements UserRepository {
  async getUserById(id: string): Promise<User | null> {
    try {
      return await prisma.user.findUnique({ where: { id } });
    } catch (error) {
      console.error("❌ getUserById 오류 발생:", error);
      throw new Error("사용자 정보를 가져오는 데 실패했습니다.");
    } finally {
      await prisma.$disconnect();
    }
  }
}
