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
        const bookmark = await prisma.bookmark.findUnique({
            where: { spotId_userId: { spotId, userId } },
        });

        return !!bookmark;
    }

    async createBookmark(spotId: number, userId: string): Promise<void> {
        await prisma.bookmark.create({
            data: { spotId, userId },
        });
    }

    async deleteBookmark(spotId: number, userId: string): Promise<void> {
        await prisma.bookmark.delete({
            where: { spotId_userId: { spotId, userId } },
        });
    }
}
