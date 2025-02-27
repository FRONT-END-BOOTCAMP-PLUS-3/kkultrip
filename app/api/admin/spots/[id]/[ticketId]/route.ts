import { NextResponse } from "next/server";
import { PgTicketRepository } from "@/infrastructure/repositories/PgTicketRepository";
import { DeleteTicketUseCase } from "@/application/usecases/ticket/DeleteTicketUseCase";

export async function DELETE(req: Request) {
  try {
    const url = new URL(req.url);
    const id = url.pathname.split("/").pop();

    if (!id || isNaN(Number(id))) {
      return NextResponse.json(
        { error: "Valid Ticket ID is required" },
        { status: 400 }
      );
    }

    const ticketRepository = new PgTicketRepository();
    const deleteTicketUseCase = new DeleteTicketUseCase(ticketRepository);

    await deleteTicketUseCase.execute(Number(id));

    return NextResponse.json({ message: "Ticket deleted" }, { status: 200 });
  } catch (error) {
    console.error("Error deleting ticket:", error);
    return NextResponse.json(
      { error: "Failed to delete ticket" },
      { status: 500 }
    );
  }
}
