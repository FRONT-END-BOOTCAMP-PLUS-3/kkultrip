import { NextResponse } from "next/server";
import { GetSpotListUseCase } from "@/application/usecases/admin/spot/GetSpotListUseCase";
import { TicketRepository } from "@/domain/repositories/TicketRepository";
import { CreateSpotUseCase } from "@/application/usecases/admin/spot/CreateSpotUseCase";
import PgSpotRepository from "@/infrastructure/repositories/PgSpotRepository";
import { PgTicketRepository } from "@/infrastructure/repositories/PgTicketRepository";
import { promises as fs } from "fs";
import path from "path";
import { CreateSpotDto } from "@/application/usecases/admin/spot/dto/CreateSpotDto";
import SpotRepository from "@/domain/repositories/SpotRepository";
import TimeRepository from "@/domain/repositories/TimeRepository";
import DocentRepository from "@/domain/repositories/DocentRepository";
import { PgTimeRepository } from "@/infrastructure/repositories/PgTimeRepository";
import PgDocentRepository from "@/infrastructure/repositories/PgDocentRepository";

const UPLOAD_IMAGES_DIR = "/home/honeytrip/upload/images"; // 이미지 업로드 기본 경로
const UPLOAD_SPOT_DIR = path.join(UPLOAD_IMAGES_DIR, "spots"); // 스팟 이미지 저장 경로
const UPLOAD_AUDIOS_DIR = "/home/honeytrip/upload/audios"; // 오디오 업로드 경로

export async function GET(req: Request) {
  try {
    const url = new URL(req.url);
    const page = parseInt(url.searchParams.get("page") || "1", 10);

    const spotRepository: SpotRepository = new PgSpotRepository();
    const getSpotListUseCase = new GetSpotListUseCase(spotRepository);
    const spots = await getSpotListUseCase.execute(page);
    return NextResponse.json(spots, { status: 200 });
  } catch (error) {
    console.log("Error fetching spots:", error);

    return NextResponse.json(
      { error: "Failed to fetch spots" },
      { status: 500 }
    );
  }
}

// POST 메서드 내에서 파일 저장 부분 수정
export async function POST(req: Request) {
  try {
    const formData = await req.formData();
    const body = JSON.parse(formData.get("body") as string) as CreateSpotDto;
    const file = formData.get("file") as File;

    const spotRepository: SpotRepository = new PgSpotRepository();
    const ticketRepository: TicketRepository = new PgTicketRepository();
    const timeRepository: TimeRepository = new PgTimeRepository();
    const docentRepository: DocentRepository = new PgDocentRepository();
    const createSpotUseCase = new CreateSpotUseCase(
      spotRepository,
      ticketRepository,
      timeRepository,
      docentRepository
    );

    if (file) {
      const buffer = await file.arrayBuffer();
      const uploadDir = path.join("/home/honeytrip/upload", "images", "spots");

      // 디렉터리가 존재하지 않으면 생성
      await fs.mkdir(uploadDir, { recursive: true });

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
      body.img = `/images/spots/${fileName}${fileExt}`;
    }

    if (body.docents) {
      for (let i = 0; i < body.docents.length; i++) {
        const audioFile = formData.get(`docentAudio${i}`) as File;
        if (audioFile) {
          const buffer = await audioFile.arrayBuffer();
          const uploadDir = path.join("/home/honeytrip/upload", "audios");

          // 디렉터리가 존재하지 않으면 생성
          await fs.mkdir(uploadDir, { recursive: true });

          let filePath = path.join(uploadDir, audioFile.name);
          let fileName = path.parse(audioFile.name).name;
          const fileExt = path.parse(audioFile.name).ext;

          const existingFiles = await fs.readdir(uploadDir);
          const fileNames = existingFiles.map((f) => path.parse(f).name);

          let counter = 1;
          while (fileNames.includes(fileName)) {
            fileName = `${fileName}_${counter}`;
            filePath = path.join(uploadDir, `${fileName}${fileExt}`);
            counter++;
          }

          await fs.writeFile(filePath, Buffer.from(buffer));
          body.docents[i].audioPath = `/audio/${fileName}${fileExt}`;
        }
      }
    }

    const { spot, tickets, times, docents } = await createSpotUseCase.execute(
      body
    );

    return NextResponse.json(
      { spot, tickets, times, docents },
      { status: 201 }
    );
  } catch (error) {
    console.log("Spot 생성 오류:", error);
    return NextResponse.json(
      { error: "서버 오류가 발생했습니다." },
      { status: 500 }
    );
  }
}
