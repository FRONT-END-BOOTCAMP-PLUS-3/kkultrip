import SignupUsecase from "@/application/usecases/user/SignupUsecase";
import UserRepository from "@/domain/repositories/UserRepository";
import { PgUserRepository } from "@/infrastructure/repositories/PgUserRepository";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const { nickname, email, password } = await req.json();

    if (!nickname || !email || !password) {
      return NextResponse.json(
        { message: "모든 필드를 입력해주세요." },
        { status: 400 }
      );
    }

    const userRepository: UserRepository = new PgUserRepository();
    const usecase = new SignupUsecase(userRepository);
    await usecase.execute({
      nickname,
      email,
      password,
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
