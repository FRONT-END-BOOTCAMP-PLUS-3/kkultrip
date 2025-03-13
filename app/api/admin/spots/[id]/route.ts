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

      if (existingSpot.img) {
        try {
          const existingImagePath = path.join(
            process.cwd(),
            "public",
            existingSpot.img
          );
          await fs.unlink(existingImagePath);
        } catch (unlinkError) {
          console.log("Failed to delete old image:", unlinkError);
        }
      }

      await fs.writeFile(filePath, Buffer.from(buffer));
      updateData.img = `/images/spots/${fileName}${fileExt}`;
    }

    if (docents) {
      for (let i = 0; i < docents.length; i++) {
        const audioFile = formData.get(`docentAudio${i}`) as File;
        if (audioFile) {
          const buffer = await audioFile.arrayBuffer();
          let filePath = path.join(uploadDirAudios, audioFile.name);
          let fileName = path.parse(audioFile.name).name;
          const fileExt = path.parse(audioFile.name).ext;

          const existingFiles = await fs.readdir(uploadDirAudios);
          const fileNames = existingFiles.map((f) => path.parse(f).name);

          let counter = 1;
          while (fileNames.includes(fileName)) {
            fileName = `${fileName}_${counter}`;
            filePath = path.join(uploadDirAudios, `${fileName}${fileExt}`);
            counter++;
          }

          if (docents[i].audioPath) {
            try {
              const existingAudioPath = path.join(
                process.cwd(),
                "public",
                docents[i].audioPath
              );
              await fs.unlink(existingAudioPath);
            } catch (unlinkError) {
              console.log("Failed to delete old audio:", unlinkError);
            }
          }

          await fs.writeFile(filePath, Buffer.from(buffer));
          docents[i].audioPath = `/audios/${fileName}${fileExt}`;
        }
      }
    }

    const updatedSpot = await updateSpotUseCase.execute(id, {
      ...updateData,
      tickets,
      times,
      docents,
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
        console.log("No existing image found or failed to delete:", error);
      }
    }

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
