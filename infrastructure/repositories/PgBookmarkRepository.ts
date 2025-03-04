import BookmarkRepository from "@/domain/repositories/BookmarkRepository";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export class PgBookmarkRepository implements BookmarkRepository {
    async countBySpot(spotId: number): Promise<number> {
        return prisma.bookmark.count({ where: { spotId } });
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
