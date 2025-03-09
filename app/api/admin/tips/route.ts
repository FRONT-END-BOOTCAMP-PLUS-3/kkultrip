import { NextResponse } from "next/server";
import { GetTipListUseCase } from "@/application/usecases/admin/tip/GetTipListUseCase";
import { PgTipRepository } from "@/infrastructure/repositories/PgTipRepository";
import PgSpotRepository from "@/infrastructure/repositories/PgSpotRepository";
import DeleteTipUsecase from "@/application/usecases/spot/tips/DeleteTipUsecase";

export async function GET(req: Request) {
  try {
    const url = new URL(req.url);
    const page = parseInt(url.searchParams.get("page") || "1", 10);

    const tipRepository = new PgTipRepository();
    const spotRepository = new PgSpotRepository();
    const getTipUseCase = new GetTipListUseCase(tipRepository, spotRepository);

    const tips = await getTipUseCase.execute(page);

    return NextResponse.json(tips, { status: 200 });
  } catch (error) {
    console.error("Error fetching tips:", error);
    return NextResponse.json(
      { error: "Failed to fetch tips" },
      { status: 500 }
    );
  }
}

export async function DELETE(request: Request) {
  try {
    const { tipId, spotId } = await request.json();
    const tipRepository = new PgTipRepository();
    const spotRepository = new PgSpotRepository();

    const deleteTipUsecase = new DeleteTipUsecase(
      tipRepository,
      spotRepository
    );

    await deleteTipUsecase.execute(tipId, spotId);

    return NextResponse.json(
      { message: "Tip deleted successfully" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error deleting tip:", error);

    return NextResponse.json(
      { error: "Failed to delete tip" },
      { status: 500 }
    );
  }
}
