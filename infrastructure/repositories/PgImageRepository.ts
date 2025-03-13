import { prisma } from "@/lib/prisma";
import { ImageRepository } from "@/domain/repositories/ImageRepository";
import path from "path";
import fs from "fs";
import { Image } from "@prisma/client";

const UPLOAD_BASE_DIR = "/home/honeytrip/upload/images"; // 업로드 기본 경로
const UPLOAD_TIP_DIR = path.join(UPLOAD_BASE_DIR, "tips"); // 팁 이미지 저장 경로
export class PgImageRepository implements ImageRepository {
  async createImages(tipId: number, imageFiles: File[]): Promise<void> {
    // 저장 폴더가 없으면 생성
    if (!fs.existsSync(UPLOAD_BASE_DIR)) {
      fs.mkdirSync(UPLOAD_BASE_DIR, { recursive: true });
    }

    // 📌 팁 이미지 폴더가 없으면 생성
    if (!fs.existsSync(UPLOAD_TIP_DIR)) {
      fs.mkdirSync(UPLOAD_TIP_DIR, { recursive: true });
    }

    try {
      for (const file of imageFiles) {
        const fileName = `${tipId}_${Date.now()}_${file.name}`;
        const filePath = path.join(UPLOAD_TIP_DIR, fileName);
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
    } catch (error) {
      console.log("❌ createImages 오류 발생:", error);
      throw new Error("이미지 저장 중 오류가 발생했습니다.");
    } finally {
      await prisma.$disconnect();
    }
  }

  async getImagesByTipId(tipId: number): Promise<string[]> {
    try {
      const images = await prisma.image.findMany({
        where: { tipId },
        select: { path: true },
      });
      return images.map((img) => img.path || "");
    } catch (error) {
      console.log("❌ getImagesByTipId 오류 발생:", error);
      throw new Error("이미지 정보를 가져오는 데 실패했습니다.");
    } finally {
      await prisma.$disconnect();
    }
  }

  async deleteImagesByPaths(imagePaths: string[]) {
    try {
      await prisma.image.deleteMany({
        where: { path: { in: imagePaths } },
      });

      // 로컬 파일 삭제
      imagePaths.forEach((imagePath) => {
        const filePath = path.join("/home/honeytrip/upload/", imagePath);
        if (fs.existsSync(filePath)) {
          fs.unlinkSync(filePath);
        }
      });
    } catch (error) {
      console.log("❌ deleteImagesByPaths 오류 발생:", error);
      throw new Error("이미지 삭제 중 오류가 발생했습니다.");
    } finally {
      await prisma.$disconnect();
    }
  }

  async deleteImageById(id: number): Promise<void> {
    try {
      // 이미지 경로를 DB에서 조회
      const image = await prisma.image.findUnique({
        where: { id },
        select: { path: true },
      });

      if (!image) {
        throw new Error("이미지를 찾을 수 없습니다.");
      }

      // 로컬 파일 삭제
      const filePath = path.join(process.cwd(), "public", image.path!);
      if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath);
      }

      // DB에서 이미지 삭제
      await prisma.image.delete({
        where: { id },
      });
    } catch (error) {
      console.log("❌ deleteImage 오류 발생:", error);
      throw new Error("이미지 삭제 중 오류가 발생했습니다.");
    } finally {
      await prisma.$disconnect();
    }
  }

  async getImageByTipId(tipId: number): Promise<Image[]> {
    const images = await prisma.image.findMany({
      where: { tipId },
    });
    return images;
  }

  async getAllImages(): Promise<Image[]> {
    const images = await prisma.image.findMany();
    return images;
  }
}
