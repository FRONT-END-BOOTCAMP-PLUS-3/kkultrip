import { NextRequest, NextResponse } from "next/server";
import GetUserUseCase from "@/application/usecases/admin/user/GetUserUseCase";
import { PgUserRepository } from "@/infrastructure/repositories/PgUserRepository";
import { UpdateUserRoleUseCase } from "@/application/usecases/admin/user/UpdateUserRoleUseCase";

export async function GET(req: NextRequest) {
  try {
    const pathname = req.nextUrl.pathname;
    const userId = pathname.split("/").pop();

    if (!userId) {
      return NextResponse.json(
        { error: "User ID is missing" },
        { status: 400 }
      );
    }

    const userRepository = new PgUserRepository();
    const getUserUseCase = new GetUserUseCase(userRepository);
    const user = await getUserUseCase.execute(userId);

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    return NextResponse.json(user, { status: 200 });
  } catch (error) {
    console.error("Error fetching user:", error);
    return NextResponse.json(
      { error: "Failed to fetch user" },
      { status: 500 }
    );
  }
}

export async function PATCH(req: NextRequest) {
  try {
    const pathname = req.nextUrl.pathname;
    const userId = pathname.split("/").pop();

    if (!userId) {
      return NextResponse.json(
        { error: "User ID is missing" },
        { status: 400 }
      );
    }
    const { isAdmin }: { isAdmin: boolean } = await req.json();
    if (typeof isAdmin !== "boolean") {
      return NextResponse.json(
        { error: "Invalid isAdmin value" },
        { status: 400 }
      );
    }
    const userRepository = new PgUserRepository();
    const updateUserRoleUseCase = new UpdateUserRoleUseCase(userRepository);
    await updateUserRoleUseCase.execute({ id: userId, isAdmin });

    return NextResponse.json(
      { message: "User role updated successfully" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error updating user role:", error);
    return NextResponse.json(
      { error: "Failed to update user role" },
      { status: 500 }
    );
  }
}
