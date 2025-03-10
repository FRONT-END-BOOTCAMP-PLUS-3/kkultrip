import { NextRequest, NextResponse } from "next/server";
import { PgUserRepository } from "@/infrastructure/repositories/PgUserRepository";
import CheckEmailUseCase from "@/application/usecases/user/CheckEmailUsecase";

export async function POST(req: NextRequest) {
  try {
    const { email } = await req.json();
    const userRepository = new PgUserRepository();
    const checkEmailUseCase = new CheckEmailUseCase(userRepository);

    const isAvailable = await checkEmailUseCase.execute(email);

    return NextResponse.json({ isAvailable }, { status: 200 });
  } catch (error) {
    console.log("이메일 중복 확인 오류:", error);
    return NextResponse.json(
      { message: error instanceof Error ? error.message : "서버 오류 발생" },
      { status: 500 }
    );
  }
}
