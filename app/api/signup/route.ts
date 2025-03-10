import SignupUsecase from "@/application/usecases/user/SignupUsecase";
import UserRepository from "@/domain/repositories/UserRepository";
import { PgUserRepository } from "@/infrastructure/repositories/PgUserRepository";
import { promises as fs } from "fs";
import { writeFile } from "fs/promises";
import { NextRequest, NextResponse } from "next/server";
import path from "path";

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();

    const nickname = formData.get("nickname") as string;
    const email = formData.get("email") as string;
    const password = formData.get("password") as string;

    if (!nickname || !email || !password) {
      return NextResponse.json(
        { message: "프로필 사진을 뺀 모든 필드를 입력해주세요." },
        { status: 400 }
      );
    }

    const file = formData.get("file") as File | null;
    let imagePath = "/images/users/default.png";

    if (file) {
      const bytes = await file.arrayBuffer();
      const buffer = Buffer.from(bytes);

      const uploadDir = path.join(process.cwd(), "public/images/users");
      await fs.mkdir(uploadDir, { recursive: true });

      const fileName = `${Date.now()}_${file.name}`;
      imagePath = `/images/users/${fileName}`;

      await writeFile(path.join(uploadDir, fileName), buffer);
    }

    const userRepository: UserRepository = new PgUserRepository();
    const usecase = new SignupUsecase(userRepository);
    await usecase.execute({
      nickname,
      email,
      password,
      img: imagePath,
    });

    return NextResponse.json(
      {
        message: "회원가입 성공",
      },
      { status: 201 }
    );
  } catch (error: unknown) {
    if (error instanceof Error) {
      console.log("회원가입 실패:", error.message);
    } else {
      console.log("회원가입 실패:", error);
    }
    return NextResponse.json(
      { message: (error as Error).message || "서버 오류가 발생했습니다." },
      { status: 500 }
    );
  }
}
