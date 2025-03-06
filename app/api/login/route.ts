import { NextRequest, NextResponse } from "next/server";
import { LoginUsecase } from "@/application/usecases/user/LoginUsecase";
import { PgUserRepository } from "@/infrastructure/repositories/PgUserRepository";
import { UserRepository } from "@/domain/repositories/UserRepository";

export async function POST(req: NextRequest) {
  try {
    const { email, password } = await req.json();

    if (!email || !password) {
      return NextResponse.json(
        { message: "모든 필드를 입력해주세요." },
        { status: 400 }
      );
    }

    const userRepository: UserRepository = new PgUserRepository();
    const usecase = new LoginUsecase(userRepository);
    const { token, isAdmin } = await usecase.execute({ email, password });
    if (!token) {
      return NextResponse.json(
        { message: "이메일 또는 비밀번호를 확인하세요." },
        { status: 401 }
      );
    }

    const response = NextResponse.json(
      { message: "로그인 성공", isAdmin },
      { status: 200 }
    );

    response.cookies.set("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 60 * 60 * 24, // 하루
      path: "/",
    });

    return response;
  } catch (error: unknown) {
    if (error instanceof Error && error.message === "isNotComparePassword") {
      return NextResponse.json(
        { message: "비밀번호를 확인하세요" },
        { status: 303 }
      );
    }
  }

  return NextResponse.json(
    { message: "Unknown error occurred" },
    { status: 500 }
  );
}
