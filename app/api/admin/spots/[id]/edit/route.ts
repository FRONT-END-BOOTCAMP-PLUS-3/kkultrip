import { NextResponse } from "next/server";
import { GetSpotUseCase } from "@/application/usecases/admin/spot/GetSpotUseCase";
import { UpdateSpotUseCase } from "@/application/usecases/UpdateSpotUseCase";
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

export async function PATCH(req: Request) {
  try {
    const { id, ...updateData } = await req.json();

    if (!id) {
      return NextResponse.json({ error: "ID is required" }, { status: 400 });
    }

    const spotRepository = new PgSpotRepository();
    const updateSpotUseCase = new UpdateSpotUseCase(spotRepository);
    const updatedSpot = await updateSpotUseCase.execute(id, updateData);

    return NextResponse.json(updatedSpot, { status: 200 });
  } catch (error) {
    console.error("Error updating spot:", error);
    return NextResponse.json(
      { error: "Failed to update spot" },
      { status: 500 }
    );
  }
}
