import { NextResponse } from "next/server";
import { GetSpotByIdUseCase } from "@/application/usecases/admin/spot/GetSpotByIdUseCase";
import { UpdateSpotUseCase } from "@/application/usecases/admin/spot/UpdateSpotUseCase";
import { DeleteSpotUseCase } from "@/application/usecases/admin/spot/DeleteSpotUseCase";
import { PgTicketRepository } from "@/infrastructure/repositories/PgTicketRepository";
import { TicketRepository } from "@/domain/repositories/TicketRepository";
import PgSpotRepository from "@/infrastructure/repositories/PgSpotRepository";
import SpotRepository from "@/domain/repositories/SpotRepository";
import { PgTimeRepository } from "@/infrastructure/repositories/PgTimeRepository";
import TimeRepository from "@/domain/repositories/TimeRepository";
import DocentRepository from "@/domain/repositories/DocentRepository";
import PgDocentRepository from "@/infrastructure/repositories/PgDocentRepository";
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
    console.log("Error fetching spot:", error);
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

    const existingSpot = await spotRepository.getSpotById(Number(id));
    if (!existingSpot) {
      return NextResponse.json({ error: "Spot not found" }, { status: 404 });
    }

    const existingDocent = await docentRepository.getDocentBySpotId(Number(id));
    if (!existingDocent || existingDocent.length === 0) {
      return NextResponse.json({ error: "Docent not found" }, { status: 404 });
    }

    const uploadDirImages = "/home/honeytrip/upload/images/spots";
    const uploadDirAudios = "/home/honeytrip/upload/audios";

    if (formData.has("file")) {
      const file = formData.get("file") as File;
      const buffer = await file.arrayBuffer();
      let filePath = path.join(uploadDirImages, file.name);
      let fileName = path.parse(file.name).name;
      const fileExt = path.parse(file.name).ext;

      const existingFiles = await fs.readdir(uploadDirImages);
      const fileNames = existingFiles.map((f) => path.parse(f).name);

      let counter = 1;
      while (fileNames.includes(fileName)) {
        fileName = `${fileName}_${counter}`;
        filePath = path.join(uploadDirImages, `${fileName}${fileExt}`);
        counter++;
      }

      const existingImgFilename = path.basename(existingSpot.img);
      const existingImgPath = path.join(uploadDirImages, existingImgFilename);
      await fs.access(existingImgPath);
      await fs.unlink(existingImgPath);
      await fs.writeFile(filePath, Buffer.from(buffer));
      updateData.img = `/images/spots/${fileName}${fileExt}`;
    }

    if (docents) {
      for (let i = 0; i < docents.length; i++) {
        const audioFile = formData.get(`docentAudio${i}`) as File;
        if (audioFile) {
          const buffer = await audioFile.arrayBuffer();
          const fileName = path.parse(audioFile.name).name;
          const fileExt = path.parse(audioFile.name).ext;
          const filePath = path.join(uploadDirAudios, `${fileName}${fileExt}`);
          const newAudioPath = `/audios/${fileName}${fileExt}`; // 상대 경로

          // 기존 오디오 경로 확인 및 삭제
          if (
            existingDocent[i].audioPath &&
            existingDocent[i].audioPath !== newAudioPath
          ) {
            try {
              const existingAudioPath = path.join(
                uploadDirAudios,
                path.basename(existingDocent[i].audioPath)
              );
              await fs.access(existingAudioPath); // 파일 존재 여부 확인
              await fs.unlink(existingAudioPath); // 삭제 실행
            } catch (unlinkError) {
              console.log(
                "❌ 기존 오디오 삭제 실패 (파일이 없을 수도 있음):",
                unlinkError
              );
            }
          }

          // 새 오디오 파일 저장
          await fs.writeFile(filePath, Buffer.from(buffer));

          // 새 오디오 경로 업데이트
          existingDocent[i].audioPath = newAudioPath;
        }
      }
    }

    const updatedSpot = await updateSpotUseCase.execute(id, {
      ...updateData,
      tickets,
      times,
      docents: existingDocent, // updated docents with new audio paths
    });

    return NextResponse.json(updatedSpot, { status: 200 });
  } catch (error) {
    console.log("Error updating spot:", error);
    return NextResponse.json(
      { error: "Failed to update spot" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  req: Request,
  props: { params: Promise<{ id: string }> }
) {
  try {
    const params = await props.params;
    const id = params.id;

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

    const spot = await getSpotUseCase.execute(Number(id));
    if (!spot) {
      return NextResponse.json({ error: "Spot not found" }, { status: 404 });
    }

    const uploadDirImages = "/home/honeytrip/upload/images/spots";
    const uploadDirAudios = "/home/honeytrip/upload/audios";

    if (spot.img) {
      try {
        const existingImgFilename = path.basename(spot.img);
        const existingImgPath = path.join(uploadDirImages, existingImgFilename);
        await fs.access(existingImgPath);
        await fs.unlink(existingImgPath);
        console.log(`Deleted existing image: ${existingImgFilename}`);
      } catch (error) {
        console.log("No existing image found or failed to delete:", error);
      }
    }

    for (const docent of spot.docents || []) {
      if (docent.audioPath) {
        try {
          const audioFilename = path.basename(docent.audioPath);
          const audioPath = path.join(uploadDirAudios, audioFilename);
          await fs.access(audioPath);
          await fs.unlink(audioPath);
          console.log(`Deleted audio file: ${audioFilename}`);
        } catch (error) {
          console.log(
            "No existing audio file found or failed to delete:",
            error
          );
        }
      }
    }

    const deleteSpotUseCase = new DeleteSpotUseCase(spotRepository);
    const deletedSpot = await deleteSpotUseCase.execute(Number(id));

    return NextResponse.json(deletedSpot, { status: 200 });
  } catch (error) {
    console.log("Error deleting spot:", error);
    return NextResponse.json(
      { error: "Failed to delete spot" },
      { status: 500 }
    );
  }
}
