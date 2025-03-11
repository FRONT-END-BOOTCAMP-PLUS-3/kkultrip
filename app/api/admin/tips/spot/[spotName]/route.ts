import { NextResponse } from "next/server";
import GetTipBySpotNameUseCase from "@/application/usecases/admin/tip/GetTipBySpotNameUseCase";
import { PgTipRepository } from "@/infrastructure/repositories/PgTipRepository";
import PgSpotRepository from "@/infrastructure/repositories/PgSpotRepository";
import { PgUserRepository } from "@/infrastructure/repositories/PgUserRepository";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const spotName = searchParams.get("spotName");

  if (!spotName) {
    return NextResponse.json(
      { error: "Spot name is required" },
      { status: 400 }
    );
  }

  try {
    const tipRepository = new PgTipRepository();
    const spotRepository = new PgSpotRepository();
    const userRepository = new PgUserRepository();

    const getTipBySpotNameUseCase = new GetTipBySpotNameUseCase(
      tipRepository,
      spotRepository,
      userRepository
    );

    const tips = await getTipBySpotNameUseCase.execute(spotName, "createdAt");

    if (!tips || tips.length === 0) {
      return NextResponse.json(
        { error: "No tips found for this spot" },
        { status: 404 }
      );
    }

    return NextResponse.json({ tips }, { status: 200 });
  } catch (error) {
    console.log("❌ Error in GET request:", error);

    return NextResponse.json(
      { error: "Something went wrong" },
      { status: 500 }
    );
  }
}
