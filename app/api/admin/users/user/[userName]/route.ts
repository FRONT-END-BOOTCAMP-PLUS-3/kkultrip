import { NextResponse } from "next/server";
import { GetUserByNameUseCase } from "@/application/usecases/admin/user/GetUserByNameUseCase";
import { PgUserRepository } from "@/infrastructure/repositories/PgUserRepository";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const userName = searchParams.get("userName");

  if (!userName) {
    return NextResponse.json(
      { error: "User name is required" },
      { status: 400 }
    );
  }

  try {
    const userRepository = new PgUserRepository();

    const getUserByUserNameUseCase = new GetUserByNameUseCase(userRepository);

    const users = await getUserByUserNameUseCase.execute(userName);
    if (!users) {
      return NextResponse.json(
        { error: "No user found with this username" },
        { status: 404 }
      );
    }

    return NextResponse.json({ users }, { status: 200 });
  } catch (error) {
    console.log("❌ Error in GET request:", error);

    return NextResponse.json(
      { error: "Something went wrong" },
      { status: 500 }
    );
  }
}
