import { NextResponse } from "next/server";
import { GetSpotByIdUseCase } from "@/application/usecases/admin/spot/GetSpotByIdUseCase";
import { UpdateSpotUseCase } from "@/application/usecases/admin/spot/UpdateSpotUseCase";
import { DeleteSpotUseCase } from "@/application/usecases/admin/spot/DeleteSpotUseCase";
import { PgTicketRepository } from "@/infrastructure/repositories/PgTicketRepository";
import { TicketRepository } from "@/domain/repositories/TicketRepository";
import PgSpotRepository from "@/infrastructure/repositories/PgSpotRepository";
import SpotRepository from "@/domain/repositories/SpotRepository";
import { PgTimeRepository } from "@/infrastructure/repositories/PgTimeRepository";
import { TimeRepository } from "@/domain/repositories/TimeRepository";
import { DocentRepository } from "@/domain/repositories/DocentRepository";
import { PgDocentRepository } from "@/infrastructure/repositories/PgDocentRepository";
import { Docent } from "@prisma/client";

export async function GET(
  req: Request,
  props: { params: Promise<{ id: string }> }
) {
  const params = await props.params;
  try {
    const id = params.id;

    if (!id) {
      return NextResponse.json({ error: "ID is required" }, { status: 400 });
    }

    const spotRepository: SpotRepository = new PgSpotRepository();
    const ticketRepository: TicketRepository = new PgTicketRepository();
    const timeRepository: TimeRepository = new PgTimeRepository();
    const docentRepository: DocentRepository = new PgDocentRepository();
    const getSpotUseCase = new GetSpotByIdUseCase(
      spotRepository,
      ticketRepository,
      timeRepository,
      docentRepository
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
    const { id, tickets, times, docents, ...updateData } = await req.json();

    if (!id) {
      return NextResponse.json(
        { error: "Spot ID is required" },
        { status: 400 }
      );
    }

    const spotRepository: SpotRepository = new PgSpotRepository();
    const ticketRepository: TicketRepository = new PgTicketRepository();
    const timeRepository: TimeRepository = new PgTimeRepository();
    const docentRepository: DocentRepository = new PgDocentRepository();
    const updateSpotUseCase = new UpdateSpotUseCase(
      spotRepository,
      ticketRepository,
      timeRepository,
      docentRepository
    );

    // 도슨트 업데이트 로직에서 audioPath를 문자열로 변환
    const updatedDocents = docents.map((docent: Docent) => ({
      ...docent,
      audioPath:
        typeof docent.audioPath === "object"
          ? (docent.audioPath as { path: string }).path
          : docent.audioPath,
    }));

    const updatedSpot = await updateSpotUseCase.execute(id, {
      ...updateData,
      tickets,
      times,
      docents: updatedDocents,
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
