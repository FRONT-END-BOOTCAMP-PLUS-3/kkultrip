import { NextResponse } from "next/server";
import { GetSpotsUseCase } from "@/application/usecases/admin/spot/GetSpotsUseCase";
import { CreateSpotUseCase } from "@/application/usecases/admin/spot/CreateSpotUseCase";
import { PgSpotRepository } from "@/infrastructure/repositories/PgSpotRepository";

export async function GET() {
  try {
    const spotRepository = new PgSpotRepository();
    const getSpotUseCase = new GetSpotsUseCase(spotRepository);
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

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const spotRepository = new PgSpotRepository();
    const createSpotUseCase = new CreateSpotUseCase(spotRepository);
    const spot = await createSpotUseCase.execute(body);

    return NextResponse.json(spot, { status: 201 });
  } catch (error) {
    console.error("Spot 생성 오류:", error);
    return NextResponse.json(
      { error: "서버 오류가 발생했습니다." },
      { status: 500 }
    );
  }
}
