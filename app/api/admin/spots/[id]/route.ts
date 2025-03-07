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
import { promises as fs } from "fs";
import path from "path";

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
    const formData = await req.formData();
    const { id, tickets, times, docents, ...updateData } = JSON.parse(
      formData.get("body") as string
    );

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

    // 기존 데이터 조회
    const existingSpot = await spotRepository.getSpotById(Number(id));
    if (!existingSpot) {
      return NextResponse.json({ error: "Spot not found" }, { status: 404 });
    }

    const uploadDir = path.join(process.cwd(), "public", "images", "spots");

    // 기존 이미지 삭제 로직
    if (existingSpot.img) {
      const existingImagePath = path.join(
        process.cwd(),
        "public",
        existingSpot.img
      );
      try {
        await fs.unlink(existingImagePath);
      } catch (unlinkError) {
        console.warn("Failed to delete old image:", unlinkError);
      }
    }

    // 새 이미지 파일 처리
    const file = formData.get("file") as File;
    if (file) {
      const buffer = await file.arrayBuffer();
      let filePath = path.join(uploadDir, file.name);
      let fileName = path.parse(file.name).name;
      const fileExt = path.parse(file.name).ext;

      const existingFiles = await fs.readdir(uploadDir);
      const fileNames = existingFiles.map((f) => path.parse(f).name);

      let counter = 1;
      while (fileNames.includes(fileName)) {
        fileName = `${fileName}_${counter}`;
        filePath = path.join(uploadDir, `${fileName}${fileExt}`);
        counter++;
      }

      await fs.writeFile(filePath, Buffer.from(buffer));
      updateData.img = `/images/spots/${fileName}${fileExt}`;
    }

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
    const getSpotUseCase = new GetSpotByIdUseCase(
      spotRepository,
      new PgTicketRepository(),
      new PgTimeRepository(),
      new PgDocentRepository()
    );

    // 1️⃣ 삭제할 Spot 데이터 조회
    const spot = await getSpotUseCase.execute(Number(id));
    if (!spot) {
      return NextResponse.json({ error: "Spot not found" }, { status: 404 });
    }

    // 2️⃣ 기존 이미지 삭제
    if (spot.img) {
      try {
        const existingImgFilename = path.basename(spot.img);
        const existingImgPath = path.join(
          process.cwd(),
          "public",
          "images",
          "spots",
          existingImgFilename
        );
        await fs.access(existingImgPath);
        await fs.unlink(existingImgPath);
        console.log(`Deleted existing image: ${existingImgFilename}`);
      } catch (error) {
        console.warn("No existing image found or failed to delete:", error);
      }
    }

    // 3️⃣ 기존 오디오 파일 삭제 (도슨트 정보에서 audioPath 제거)
    for (const docent of spot.docents || []) {
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
          console.warn(
            "No existing audio file found or failed to delete:",
            error
          );
        }
      }
    }

    // 4️⃣ Spot 데이터 삭제
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
