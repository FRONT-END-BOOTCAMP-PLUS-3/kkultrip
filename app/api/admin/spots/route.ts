import { NextResponse } from "next/server";
import { GetSpotUseCase } from "@/application/usecases/GetSpotUseCase";
import { PgSpotRepository } from "@/infrastructure/repositories/PgSpotRepository";

export async function GET() {
  try {
    const spotRepository = new PgSpotRepository();
    const getSpotUseCase = new GetSpotUseCase(spotRepository);
    const spots = await getSpotUseCase.execute();

    return NextResponse.json(spots, { status: 200 });
  } catch (error) {
    console.error("Error fetching spots:", error);

    return NextResponse.json(
      { error: "Failed to fetch spots" },
      { status: 500 }
    );
  }
}
