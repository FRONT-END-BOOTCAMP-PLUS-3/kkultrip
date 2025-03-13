import { NextResponse } from "next/server";
import { GetSpotsByAddressUseCase } from "@/application/usecases/admin/spot/GetSpotsByAddressUseCase";
import PgSpotRepository from "@/infrastructure/repositories/PgSpotRepository";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const address = searchParams.get("address");

  if (!address) {
    return NextResponse.json(
      { error: "Spot name is required" },
      { status: 400 }
    );
  }

  try {
    const spotRepository = new PgSpotRepository();

    const getSpotsByAddressUsecase = new GetSpotsByAddressUseCase(
      spotRepository
    );

    const spots = await getSpotsByAddressUsecase.execute(address);

    if (!spots || spots.length === 0) {
      return NextResponse.json(
        { error: "No spot found with this name" },
        { status: 404 }
      );
    }

    return NextResponse.json({ spots }, { status: 200 });
  } catch (error) {
    console.log("❌ Error in GET request:", error);

    return NextResponse.json(
      { error: "Something went wrong" },
      { status: 500 }
    );
  }
}
