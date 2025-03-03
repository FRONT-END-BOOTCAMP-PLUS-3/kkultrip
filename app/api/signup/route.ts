import { CreateUserDto } from "@/application/usecases/user/dto/CreateUserDto";
import SignupUsecase from "@/application/usecases/user/SignupUsecase";
import { UserRepository } from "@/domain/repositories/UserRepository";
import { PgUserRepository } from "@/infrastructure/repositories/PgUserRepository";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const createUserDto: CreateUserDto = await req.json();

    const { img, nickname, email, password } = createUserDto;
    if (!img || !nickname || !email || !password) {
      return NextResponse.json(
        { message: "모든 필드를 입력해주세요." },
        { status: 400 }
      );
    }

    const userRepository: UserRepository = new PgUserRepository();
    const usecase = new SignupUsecase(userRepository);
    const newUser = await usecase.execute(createUserDto);

    return NextResponse.json(
      {
        message: "회원가입 성공",
        user: {
          id: newUser.id,
          nickname: newUser.nickname,
          email: newUser.email,
        },
      },
      { status: 201 }
    );
  } catch (error: unknown) {
    if (error instanceof Error) {
      console.error("회원가입 실패:", error.message);
    } else {
      console.error("회원가입 실패:", error);
    }
    return NextResponse.json(
      { message: (error as Error).message || "서버 오류가 발생했습니다." },
      { status: 500 }
    );
  }
}
