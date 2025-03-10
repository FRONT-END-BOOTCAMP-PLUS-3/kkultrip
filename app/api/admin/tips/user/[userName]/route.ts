import { NextResponse } from "next/server";
import GetTipByUserNameUseCase from "@/application/usecases/admin/tip/GetTipByUserNameUseCase";
import { PgTipRepository } from "@/infrastructure/repositories/PgTipRepository";
import PgSpotRepository from "@/infrastructure/repositories/PgSpotRepository";
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
    const tipRepository = new PgTipRepository();
    const spotRepository = new PgSpotRepository();
    const userRepository = new PgUserRepository();

    const getTipByUserNameUseCase = new GetTipByUserNameUseCase(
      tipRepository,
      spotRepository,
      userRepository
    );

    const tips = await getTipByUserNameUseCase.execute(userName, "createdAt");

    if (!tips || tips.length === 0) {
      return NextResponse.json(
        { error: "No tips found for this user" },
        { status: 404 }
      );
    }

    return NextResponse.json({ tips }, { status: 200 });
  } catch (error) {
    console.error("❌ Error in GET request:", error);

    return NextResponse.json(
      { error: "Something went wrong" },
      { status: 500 }
    );
  }
}
