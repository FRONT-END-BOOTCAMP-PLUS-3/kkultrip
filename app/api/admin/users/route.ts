import { NextResponse } from "next/server";
import GetUserListUseCase from "@/application/usecases/admin/user/GetUserListUseCase";
import { PgUserRepository } from "@/infrastructure/repositories/PgUserRepository";

export async function GET(req: Request) {
  try {
    const url = new URL(req.url);
    const page = parseInt(url.searchParams.get("page") || "1", 10); // URL에서 페이지 번호 가져오기

    const userRepository = new PgUserRepository();
    const getUserListUseCase = new GetUserListUseCase(userRepository);

    // 페이지네이션을 고려하여 사용자 목록 가져오기
    const usersWithPagination = await getUserListUseCase.execute(page);

    return NextResponse.json(usersWithPagination, { status: 200 });
  } catch (error) {
    console.log("Error fetching users:", error);
    return NextResponse.json(
      { error: "Failed to fetch users" },
      { status: 500 }
    );
  }
}
