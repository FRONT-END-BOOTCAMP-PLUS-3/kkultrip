import BookmarkRepository from "@/domain/repositories/BookmarkRepository";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export class PgBookmarkRepository implements BookmarkRepository {
  async countBySpot(spotId: number): Promise<number> {
    return prisma.bookmark.count({ where: { spotId } });
  }
}
