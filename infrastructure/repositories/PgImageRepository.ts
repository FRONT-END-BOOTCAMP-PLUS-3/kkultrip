import { prisma } from "@/lib/prisma";
import { ImageRepository } from "@/domain/repositories/ImageRepository";
import path from "path";
import fs from "fs";
import { Image } from "@prisma/client";

export class PgImageRepository implements ImageRepository {
  async createImages(tipId: number, imageFiles: File[]): Promise<void> {
    const uploadDir = path.join(process.cwd(), "public/images/tips");

    // 저장 폴더가 없으면 생성
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }

    for (const file of imageFiles) {
      const fileName = `${tipId}_${Date.now()}_${file.name}`;
      const filePath = path.join(uploadDir, fileName);
      const fileUrl = `/images/tips/${fileName}`;

      // 파일 저장
      const fileBuffer = await file.arrayBuffer();
      fs.writeFileSync(filePath, Buffer.from(fileBuffer));

      // DB 저장
      await prisma.image.create({
        data: {
          tipId,
          path: fileUrl,
        },
      });
    }
  }

  async getImagesByTipId(tipId: number): Promise<string[]> {
    const images = await prisma.image.findMany({
      where: { tipId },
      select: { path: true },
    });
    return images.map((img) => img.path || "");
  }

  async deleteImagesByPaths(imagePaths: string[]) {
    await prisma.image.deleteMany({
      where: { path: { in: imagePaths } },
    });

    // 로컬 파일 삭제
    imagePaths.forEach((imagePath) => {
      const filePath = path.join(process.cwd(), "public", imagePath);
      if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath);
      }
    });
  }

  async getImageByTipId(tipId: number): Promise<Image[]> {
    const images = await prisma.image.findMany({
      where: { tipId },
    });
    return images;
  }
}
