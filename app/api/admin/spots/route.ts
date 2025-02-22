import { NextResponse } from "next/server";
import { GetSpotUseCase } from "@/application/usecases/GetSpotUseCase";

export async function GET() {
  try {
    const getSpotUseCase = new GetSpotUseCase();
    const spots = await getSpotUseCase.execute();

    return NextResponse.json(spots, { status: 200 });
  } catch (error) {
    console.error("Error fetching spots:", error); // 에러 로그 출력

    return NextResponse.json(
      { error: "Failed to fetch spots" },
      { status: 500 }
    );
  }
}
