import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { CreateSpotDto } from "@/application/usecases/admin/spot/dto/CreateSpotDto";

export async function POST(req: Request) {
  try {
    const body: CreateSpotDto = await req.json();

    if (
      !body.name ||
      !body.address ||
      !body.lon ||
      !body.lat ||
      !body.phone ||
      !body.category ||
      !body.img
    ) {
      return NextResponse.json(
        { error: "필수 필드가 누락되었습니다." },
        { status: 400 }
      );
    }

    const newSpot = await prisma.spot.create({
      data: {
        name: body.name,
        address: body.address,
        lon: body.lon,
        lat: body.lat,
        phone: body.phone,
        info: body.info ?? "",
        category: body.category,
        link: body.link || undefined,
        img: body.img,
        avgPrice: body.avgPrice ?? 0,
        avgWaitingTime: body.avgWaitingTime ?? 0,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    });

    return NextResponse.json(newSpot, { status: 201 });
  } catch (error) {
    console.error("Spot 생성 오류:", error);
    return NextResponse.json(
      { error: "서버 오류가 발생했습니다." },
      { status: 500 }
    );
  }
}
