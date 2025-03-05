import { prisma } from "@/lib/prisma";
import { ImageRepository } from "@/domain/repositories/ImageRepository";

export class PgImageRepository implements ImageRepository {
  async uploadImages(tipId: number, imagePaths: string[]): Promise<void> {
    await prisma.image.createMany({
      data: imagePaths.map((path) => ({
        tipId,
        path,
      })),
    });
  }

  async getImagesByTipId(tipId: number): Promise<string[]> {
    const images = await prisma.image.findMany({
      where: { tipId },
      select: { path: true },
    });
    return images.map((image) => image.path || "");
  }

  async deleteImagesByTipId(tipId: number): Promise<void> {
    await prisma.image.deleteMany({
      where: { tipId },
    });
  }
}
