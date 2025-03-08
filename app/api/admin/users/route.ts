import { NextResponse } from "next/server";
import GetUserListUseCase from "@/application/usecases/admin/user/GetUserListUseCase";
import { PgUserRepository } from "@/infrastructure/repositories/PgUserRepository";

export async function GET() {
  try {
    const userRepository = new PgUserRepository();

    const getUserListUseCase = new GetUserListUseCase(userRepository);

    const users = await getUserListUseCase.execute();
    return NextResponse.json(users, { status: 200 });
  } catch (error) {
    console.error("Error fetching users:", error);
    return NextResponse.json(
      { error: "Failed to fetch users" },
      { status: 500 }
    );
  }
}
