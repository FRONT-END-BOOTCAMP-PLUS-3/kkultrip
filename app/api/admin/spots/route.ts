import { NextResponse } from "next/server";
import { GetSpotsUseCase } from "@/application/usecases/admin/spot/GetSpotsUseCase";
import { TicketRepository } from "@/domain/repositories/TicketRepository";
import { CreateSpotUseCase } from "@/application/usecases/admin/spot/CreateSpotUseCase";
import PgSpotRepository from "@/infrastructure/repositories/PgSpotRepository";
import { PgTicketRepository } from "@/infrastructure/repositories/PgTicketRepository"; // TicketRepository 추가
import { promises as fs } from "fs";
import path from "path";
import { CreateSpotDto } from "@/application/usecases/admin/spot/dto/CreateSpotDto";
import SpotRepository from "@/domain/repositories/SpotRepository";

export async function GET() {
  try {
    const spotRepository: SpotRepository = new PgSpotRepository();
    const getSpotUseCase = new GetSpotsUseCase(spotRepository);
    const spots = await getSpotUseCase.execute();

    return NextResponse.json(spots, { status: 200 });
  } catch (error) {
    console.error("Error fetching spots:", error);

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
    const createSpotUseCase = new CreateSpotUseCase(
      spotRepository,
      ticketRepository
    );

    if (file) {
      const buffer = await file.arrayBuffer();
      const uploadDir = path.join(process.cwd(), "public", "images", "spots");
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

    const { spot, tickets } = await createSpotUseCase.execute(body);

    return NextResponse.json({ spot, tickets }, { status: 201 });
  } catch (error) {
    console.error("Spot 생성 오류:", error);
    return NextResponse.json(
      { error: "서버 오류가 발생했습니다." },
      { status: 500 }
    );
  }
}
