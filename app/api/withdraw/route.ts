import { NextRequest, NextResponse } from "next/server";
import { PgUserRepository } from "@/infrastructure/repositories/PgUserRepository";
import UserRepository from "@/domain/repositories/UserRepository";
import { GetUserInfoByJWT } from "@/utils/jwt";
import { WithdrawUsecase } from "@/application/usecases/user/WithdrawUsecase";

export async function POST(req: NextRequest) {
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

    const userRepository: UserRepository = new PgUserRepository();
    const withdrawUsecase = new WithdrawUsecase(userRepository);
    await withdrawUsecase.execute(userId);

    const response = NextResponse.json(
      { message: "회원 탈퇴 성공" },
      { status: 200 }
    );

    response.cookies.set("token", "", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      expires: new Date(0),
      path: "/",
    });

    return response;
  } catch (error: unknown) {
    console.log("회원 탈퇴 오류:", error);
    return NextResponse.json(
      { message: "서버 오류로 인해 회원 탈퇴에 실패했습니다." },
      { status: 500 }
    );
  }
}
