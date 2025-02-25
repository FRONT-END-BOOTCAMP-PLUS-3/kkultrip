import { NextResponse } from "next/server";
import { GetSpotByIdUseCase } from "@/application/usecases/admin/spot/GetSpotsByIdUseCase";
import { UpdateSpotUseCase } from "@/application/usecases/admin/spot/UpdateSpotUseCase";
import { PgSpotRepository } from "@/infrastructure/repositories/PgSpotRepository";
import { DeleteSpotUseCase } from "@/application/usecases/admin/spot/DeleteSpotUseCase";

export async function GET(
  req: Request,
  { params }: { params: { id: string } } // ✅ id 파라미터 추출
) {
  try {
    const id = params.id; // ✅ 동적 경로에서 id 가져오기

    if (!id) {
      return NextResponse.json({ error: "ID is required" }, { status: 400 });
    }

    const spotRepository = new PgSpotRepository();
    const getSpotUseCase = new GetSpotByIdUseCase(spotRepository);
    const spot = await getSpotUseCase.execute(Number(id));

    if (!spot) {
      return NextResponse.json({ error: "Spot not found" }, { status: 404 });
    }

    return NextResponse.json(spot, { status: 200 });
  } catch (error) {
    console.error("Error fetching spot:", error);
    return NextResponse.json(
      { error: "Failed to fetch spot" },
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
