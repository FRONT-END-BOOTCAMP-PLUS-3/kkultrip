import { NextRequest, NextResponse } from "next/server";
import { PgUserRepository } from "@/infrastructure/repositories/PgUserRepository";
import CheckNicknameUseCase from "@/application/usecases/user/CheckNicknameUsecase";

export async function POST(req: NextRequest) {
  try {
    const { nickname } = await req.json();
    const userRepository = new PgUserRepository();
    const checkNicknameUseCase = new CheckNicknameUseCase(userRepository);

    const isAvailable = await checkNicknameUseCase.execute(nickname);

    return NextResponse.json({ isAvailable }, { status: 200 });
  } catch (error) {
    console.log("닉네임 중복 확인 오류:", error);
    return NextResponse.json(
      { message: error instanceof Error ? error.message : "서버 오류 발생" },
      { status: 500 }
    );
  }
}
