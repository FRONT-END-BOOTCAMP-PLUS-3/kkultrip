import BookmarkRepository from "@/domain/repositories/BookmarkRepository";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export class PgBookmarkRepository implements BookmarkRepository {
  async countBySpot(spotId: number): Promise<number> {
    try {
      return await prisma.bookmark.count({ where: { spotId } });
    } catch (error) {
      console.log("❌ countBySpot 오류 발생:", error);
      throw new Error("해당 명소의 북마크 개수를 가져오는 데 실패했습니다.");
    } finally {
      await prisma.$disconnect();
    }
  }

  async checkBookmark(spotId: number, userId: string): Promise<boolean> {
    try {
      const bookmark = await prisma.bookmark.findUnique({
        where: { spotId_userId: { spotId, userId } },
      });

      return !!bookmark;
    } catch (error) {
      console.log("❌ checkBookmark 오류 발생:", error);
      throw new Error("북마크 확인 중 오류가 발생했습니다.");
    } finally {
      await prisma.$disconnect();
    }
  }

  async createBookmark(spotId: number, userId: string): Promise<void> {
    try {
      await prisma.bookmark.create({
        data: { spotId, userId },
      });
    } catch (error) {
      console.log("❌ createBookmark 오류 발생:", error);
      throw new Error("북마크 생성 중 오류가 발생했습니다.");
    } finally {
      await prisma.$disconnect();
    }
  }

  async deleteBookmark(spotId: number, userId: string): Promise<void> {
    try {
      await prisma.bookmark.delete({
        where: { spotId_userId: { spotId, userId } },
      });
    } catch (error) {
      console.log("❌ deleteBookmark 오류 발생:", error);
      throw new Error("북마크 삭제 중 오류가 발생했습니다.");
    } finally {
      await prisma.$disconnect();
    }
  }
}
