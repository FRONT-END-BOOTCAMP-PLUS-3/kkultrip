import { GetUserUsecase } from "@/application/usecases/user/GetUserUsecase";
import { UpdateUserUsecase } from "@/application/usecases/user/UpdateUserUsecase";
import UserRepository from "@/domain/repositories/UserRepository";
import { PgUserRepository } from "@/infrastructure/repositories/PgUserRepository";
import { GetUserInfoByJWT } from "@/utils/jwt";
import { NextRequest, NextResponse } from "next/server";

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
    const file = formData.get("file") as File;

    if (!nickname) {
      return NextResponse.json(
        { message: "닉네임이 필요합니다." },
        { status: 400 }
      );
    }

    const userRepository: UserRepository = new PgUserRepository();
    const usecase = new UpdateUserUsecase(userRepository);

    await usecase.execute(userId, nickname, file);

    return NextResponse.json(
      { message: "프로필 업데이트 성공" },
      { status: 200 }
    );
  } catch (error) {
    console.error("유저 프로필 수정 오류:", error);
    return NextResponse.json({ message: "서버 오류 발생" }, { status: 500 });
  }
}
