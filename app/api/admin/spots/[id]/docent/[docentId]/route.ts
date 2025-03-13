import { NextResponse } from "next/server";
import PgDocentRepository from "@/infrastructure/repositories/PgDocentRepository";
import { DeleteDocentUseCase } from "@/application/usecases/admin/spot/docent/DeleteDocentUseCase";
import DocentRepository from "@/domain/repositories/DocentRepository";
import { promises as fs } from "fs";
import path from "path";

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

    // 📌 도슨트 정보 가져오기
    const docent = await docentRepository.getDocentById(Number(id));
    if (!docent) {
      return NextResponse.json({ error: "Docent not found" }, { status: 404 });
    }

    // 📌 오디오 파일 삭제
    if (docent.audioPath) {
      try {
        const audioFilename = path.basename(docent.audioPath);
        const audioPath = path.join(
          process.cwd(),
          "public",
          "audios",
          audioFilename
        );
        await fs.access(audioPath);
        await fs.unlink(audioPath);
        console.log(`Deleted audio file: ${audioFilename}`);
      } catch (error) {
        console.log("No existing audio file found or failed to delete:", error);
      }
    }

    // 📌 도슨트 삭제
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
