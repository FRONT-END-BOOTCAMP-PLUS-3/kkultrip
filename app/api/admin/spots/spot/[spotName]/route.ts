import { NextResponse } from "next/server";
import { GetSpotsByNameUseCase } from "@/application/usecases/admin/spot/GetSpotsByNameUseCase";
import PgSpotRepository from "@/infrastructure/repositories/PgSpotRepository";

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
    const spotRepository = new PgSpotRepository();

    const getSpotsByNameUsecase = new GetSpotsByNameUseCase(spotRepository);

    const spots = await getSpotsByNameUsecase.execute(spotName);

    if (!spots || spots.length === 0) {
      return NextResponse.json(
        { error: "No spot found with this name" },
        { status: 404 }
      );
    }

    return NextResponse.json({ spots }, { status: 200 });
  } catch (error) {
    console.log("❌ Error in GET request:", error);

    return NextResponse.json(
      { error: "Something went wrong" },
      { status: 500 }
    );
  }
}
