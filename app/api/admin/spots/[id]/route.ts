import { NextResponse } from "next/server";
import { GetSpotByIdUseCase } from "@/application/usecases/admin/spot/GetSpotsByIdUseCase";
import { UpdateSpotUseCase } from "@/application/usecases/admin/spot/UpdateSpotUseCase";
import { PgSpotRepository } from "@/infrastructure/repositories/PgSpotRepository";
import { DeleteSpotUseCase } from "@/application/usecases/admin/spot/DeleteSpotUseCase";
import { PgTicketRepository } from "@/infrastructure/repositories/PgTicketRepository";

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
    const ticketRepository = new PgTicketRepository();
    const getSpotUseCase = new GetSpotByIdUseCase(
      spotRepository,
      ticketRepository
    );
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
    const { id, tickets, ...updateData } = await req.json();

    if (!id) {
      return NextResponse.json(
        { error: "Spot ID is required" },
        { status: 400 }
      );
    }

    const spotRepository = new PgSpotRepository();
    const ticketRepository = new PgTicketRepository();
    const updateSpotUseCase = new UpdateSpotUseCase(
      spotRepository,
      ticketRepository
    );

    const updatedSpot = await updateSpotUseCase.execute(id, {
      ...updateData,
      tickets,
    });

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
    const url = new URL(req.url);
    const id = url.pathname.split("/").pop();

    if (!id) {
      return NextResponse.json(
        { error: "Spot ID is required" },
        { status: 400 }
      );
    }

    const spotRepository = new PgSpotRepository();
    const deleteSpotUseCase = new DeleteSpotUseCase(spotRepository);
    const deletedSpot = await deleteSpotUseCase.execute(Number(id));

    return NextResponse.json(deletedSpot, { status: 200 });
  } catch (error) {
    console.error("Error deleting spot:", error);

    return NextResponse.json(
      { error: "Failed to delete spot" },
      { status: 500 }
    );
  }
}
