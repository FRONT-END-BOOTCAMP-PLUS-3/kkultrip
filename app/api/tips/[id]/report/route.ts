import { CreateReportUsecase } from "@/application/usecases/spot/CreateReportUsecase";
import ReportRepository from "@/domain/repositories/ReportRepository";
import { PgReportRepository } from "@/infrastructure/repositories/PgReportRepository";
import { NextResponse } from "next/server";

export async function POST(
    request: Request,
    { params }: { params: { id: string } }
) {
    const body = await request.json();
    const { userId } = body;
    const { id } = params;

    const reportRepository: ReportRepository = new PgReportRepository();
    const createReportUsecase = new CreateReportUsecase(reportRepository);
    await createReportUsecase.execute({ userId, tipId: Number(id) });
    return NextResponse.json({ message: "Report created" }, { status: 200 });
}
