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

    // 이미지 업로드 경로 설정
    if (file) {
      const buffer = await file.arrayBuffer();

      // 환경변수 HOME이 undefined일 수 있으므로 확인 후 경로 설정
      const homeDir = process.env.HOME;
      if (!homeDir) {
        throw new Error("HOME environment variable is not defined");
      }

      const uploadDir = path.join(homeDir, "upload", "images", "spots");
      let filePath = path.join(uploadDir, file.name);
      let fileName = path.parse(file.name).name;
      const fileExt = path.parse(file.name).ext;

      // 파일 이름 중복 처리
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

    // docentAudio 파일 업로드 경로 설정 (이미지 파일과 동일한 로직)
    if (body.docents) {
      for (let i = 0; i < body.docents.length; i++) {
        const audioFile = formData.get(`docentAudio${i}`) as File;
        if (audioFile) {
          const buffer = await audioFile.arrayBuffer();

          // 오디오 파일 업로드 경로 설정
          const homeDir = process.env.HOME;
          if (!homeDir) {
            throw new Error("HOME environment variable is not defined");
          }

          const uploadDir = path.join(homeDir, "upload", "audios");
          let filePath = path.join(uploadDir, audioFile.name);
          let fileName = path.parse(audioFile.name).name;
          const fileExt = path.parse(audioFile.name).ext;

          // 파일 이름 중복 처리
          const existingFiles = await fs.readdir(uploadDir);
          const fileNames = existingFiles.map((f) => path.parse(f).name);

          let counter = 1;
          while (fileNames.includes(fileName)) {
            fileName = `${fileName}_${counter}`;
            filePath = path.join(uploadDir, `${fileName}${fileExt}`);
            counter++;
          }

          await fs.writeFile(filePath, Buffer.from(buffer));
          body.docents[i].audioPath = `/audios/${fileName}${fileExt}`;
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
