import { prisma } from "@/lib/prisma";
import { ImageRepository } from "@/domain/repositories/ImageRepository";
import path from "path";
import fs from "fs";

export class PgImageRepository implements ImageRepository {
  async CreateImages(tipId: number, imageFiles: File[]): Promise<string[]> {
    const uploadDir = path.join(process.cwd(), "public/images/tips");

    // 저장 폴더가 없으면 생성
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }

    const savedPaths: string[] = [];

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

      savedPaths.push(fileUrl);
    }

    return savedPaths;
  }

  async getImagesByTipId(tipId: number): Promise<string[]> {
    const images = await prisma.image.findMany({ where: { tipId } });
    return images.map((img) => img.path || "");
  }

  async deleteImagesByTipId(tipId: number): Promise<void> {
    const images = await prisma.image.findMany({ where: { tipId } });

    // 실제 파일 삭제
    images.forEach((img) => {
      if (img.path) {
        const filePath = path.join(process.cwd(), "public", img.path);
        if (fs.existsSync(filePath)) {
          fs.unlinkSync(filePath);
        }
      }
    });

    // DB에서 이미지 삭제
    await prisma.image.deleteMany({
      where: { tipId },
    });
  }
}
