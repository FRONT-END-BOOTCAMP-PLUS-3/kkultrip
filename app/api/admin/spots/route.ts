import { NextResponse } from "next/server";
import { GetSpotsUseCase } from "@/application/usecases/admin/spot/GetSpotsUseCase";
import { DeleteSpotUseCase } from "@/application/usecases/admin/spot/DeleteSpotUseCase";
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

export async function DELETE(req: Request) {
  try {
    const { id } = await req.json();

    if (!id) {
      return NextResponse.json(
        { error: "Spot ID is required" },
        { status: 400 }
      );
    }

    const spotRepository = new PgSpotRepository();
    const deleteSpotUseCase = new DeleteSpotUseCase(spotRepository);
    const deletedSpot = await deleteSpotUseCase.execute(id);

    return NextResponse.json(deletedSpot, { status: 200 });
  } catch (error) {
    console.error("Error deleting spot:", error);

    return NextResponse.json(
      { error: "Failed to delete spot" },
      { status: 500 }
    );
  }
}
