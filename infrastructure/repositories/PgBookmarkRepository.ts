import BookmarkRepository from "@/domain/repositories/BookmarkRepository";
import { prisma } from "@/lib/prisma";

export class PgBookmarkRepository implements BookmarkRepository {
  async countBySpot(spotId: number): Promise<number> {
    if (!spotId) {
      console.error("❌ countBySpot 오류: spotId가 제공되지 않았습니다.");
      throw new Error("spotId가 없습니다.");
    }

    try {
      return await prisma.bookmark.count({ where: { spotId } });
    } catch (error) {
      console.error("❌ countBySpot 오류 발생:", error);
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

  async getSpotIdsByUserId(userId: string): Promise<number[]> {
    try {
      const bookmarks = await prisma.bookmark.findMany({
        where: { userId },
        select: { spotId: true }, // spotId만 선택
      });

      return bookmarks.map((bookmark) => bookmark.spotId);
    } catch (error) {
      console.log("❌ getSpotIdsByUserId 오류 발생:", error);
      throw new Error("사용자가 저장한 명소 목록을 가져오는 데 실패했습니다.");
    } finally {
      await prisma.$disconnect();
    }
  }
}
