import UserRepository from "@/domain/repositories/UserRepository";
import path from "path";
import fs from "fs";

const UPLOAD_USER_DIR = "/home/honeytrip/upload/images/users";
const DEFAULT_IMAGE_PATH = "/images/users/default.png";

export class UpdateUserUsecase {
  constructor(private userRepository: UserRepository) {}

  async execute(userId: string, nickname: string, file: File) {
    let imagePath: string;

    // 기존 유저 정보 조회
    const existingUser = await this.userRepository.getUserById(userId);
    if (!existingUser) throw new Error("유저 정보가 조회되지 않습니다.");

    imagePath = existingUser.img;

    if (file) {
      // 저장 디렉토리가 없으면 생성
      if (!fs.existsSync(UPLOAD_USER_DIR)) {
        fs.mkdirSync(UPLOAD_USER_DIR, { recursive: true });
      }

      // 기존 이미지가 기본 이미지가 아니라면 삭제
      if (imagePath !== DEFAULT_IMAGE_PATH) {
        const oldFilePath = path.join("/home/honeytrip/upload", imagePath);
        if (fs.existsSync(oldFilePath)) {
          fs.unlinkSync(oldFilePath);
        }
      }

      // 새로운 파일 저장
      const fileName = `${Date.now()}_${file.name}`;
      const filePath = path.join(UPLOAD_USER_DIR, fileName);
      const fileUrl = `/images/users/${fileName}`;

      // 파일 저장
      const fileBuffer = await file.arrayBuffer();
      fs.writeFileSync(filePath, Buffer.from(fileBuffer));

      // 새 이미지 경로 업데이트
      imagePath = fileUrl;
    }

    // 유저 정보 업데이트 (이미지 경로 포함)
    await this.userRepository.updateUser(userId, nickname, imagePath);
  }
}
