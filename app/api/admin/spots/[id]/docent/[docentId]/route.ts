import { NextResponse } from "next/server";
import PgDocentRepository from "@/infrastructure/repositories/PgDocentRepository";
import { DeleteDocentUseCase } from "@/application/usecases/admin/spot/docent/dto/DeleteDocentUseCase";
import DocentRepository from "@/domain/repositories/DocentRepository";

export async function DELETE(req: Request) {
  try {
    const url = new URL(req.url);
    const id = url.pathname.split("/").pop();

    if (!id || isNaN(Number(id))) {
      return NextResponse.json(
        { error: "Valid Docent ID is required" },
        { status: 400 }
      );
    }

    const docentRepository: DocentRepository = new PgDocentRepository();
    const deleteDocentUseCase = new DeleteDocentUseCase(docentRepository);
    await deleteDocentUseCase.execute(Number(id));

    return NextResponse.json({ message: "Docent deleted" }, { status: 200 });
  } catch (error) {
    console.log("Error deleting docent:", error);
    return NextResponse.json(
      { error: "Failed to delete docent" },
      { status: 500 }
    );
  }
}
