import { GetUserUsecase } from "@/application/usecases/user/GetUserUsecase";
import { UpdateUserUsecase } from "@/application/usecases/user/UpdateUserUsecase";
import UserRepository from "@/domain/repositories/UserRepository";
import { PgUserRepository } from "@/infrastructure/repositories/PgUserRepository";
import { GetUserInfoByJWT } from "@/utils/jwt";
import { NextRequest, NextResponse } from "next/server";
import { writeFile } from "fs/promises";
import path from "path";
import { promises as fs } from "fs";

export async function GET(req: NextRequest) {
  try {
    const token = req.cookies.get("token")?.value;
    if (!token) {
      return NextResponse.json(
        { message: "Unauthorized: No token provided" },
        { status: 401 }
      );
    }

    const jwtData = await GetUserInfoByJWT(token);
    if (!jwtData) {
      return NextResponse.json(
        { message: "Unauthorized: Invalid token" },
        { status: 401 }
      );
    }

    const userId = jwtData.userId as string;

    if (!userId) {
      return NextResponse.json(
        { message: "userId가 필요합니다." },
        { status: 400 }
      );
    }

    const userRepository: UserRepository = new PgUserRepository();
    const usecase = new GetUserUsecase(userRepository);

    const userData = await usecase.execute(userId);

    return NextResponse.json({ user: userData }, { status: 200 });
  } catch (error) {
    console.error("유저 정보 조회 오류:", error);
    return NextResponse.json({ message: "서버 오류 발생" }, { status: 500 });
  }
}

export async function PUT(req: NextRequest) {
  try {
    const token = req.cookies.get("token")?.value;
    if (!token) {
      return NextResponse.json(
        { message: "Unauthorized: No token provided" },
        { status: 401 }
      );
    }

    const jwtData = await GetUserInfoByJWT(token);
    if (!jwtData) {
      return NextResponse.json(
        { message: "Unauthorized: Invalid token" },
        { status: 401 }
      );
    }

    const userId = jwtData.userId as string;
    const formData = await req.formData();
    const nickname = formData.get("nickname") as string;
    const file = formData.get("file") as File | null;

    if (!nickname) {
      return NextResponse.json(
        { message: "닉네임이 필요합니다." },
        { status: 400 }
      );
    }

    const userRepository: UserRepository = new PgUserRepository();
    const usecase = new UpdateUserUsecase(userRepository);

    const existingUser = await userRepository.getUserById(userId);
    let imagePath = existingUser?.img;

    if (file) {
      if (imagePath && imagePath !== "/images/users/default.png") {
        try {
          const oldFilePath = path.join(process.cwd(), "public", imagePath);
          await fs.unlink(oldFilePath);
        } catch (error) {
          console.log("기존 프로필 이미지 삭제 실패:", error);
        }
      }

      const buffer = Buffer.from(await file.arrayBuffer());
      const uploadDir = path.join(process.cwd(), "public/images/users");
      await fs.mkdir(uploadDir, { recursive: true });

      const fileName = `${file.name}_${Date.now()}`;
      const filePath = path.join(uploadDir, fileName);
      await writeFile(filePath, buffer);
      imagePath = `/images/users/${fileName}`;
    }

    const updateUser = await usecase.execute(
      userId,
      nickname,
      imagePath as string
    );

    return NextResponse.json(
      { user: updateUser, message: "프로필 업데이트 성공" },
      { status: 200 }
    );
  } catch (error) {
    console.error("유저 프로필 수정 오류:", error);
    return NextResponse.json({ message: "서버 오류 발생" }, { status: 500 });
  }
}
