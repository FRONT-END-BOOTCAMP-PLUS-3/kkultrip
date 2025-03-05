import { CreateReportUsecase } from "@/application/usecases/spot/CreateReportUsecase";
import ReportRepository from "@/domain/repositories/ReportRepository";
import TipRepository from "@/domain/repositories/TipRepository";
import { PgReportRepository } from "@/infrastructure/repositories/PgReportRepository";
import { PgTipRepository } from "@/infrastructure/repositories/PgTipRepository";
import { NextResponse } from "next/server";

export async function POST(
    request: Request,
    props: { params: Promise<{ id: string }> }
) {
    const params = await props.params;
    const body = await request.json();
    const { userId } = body;
    const { id } = params;

    const reportRepository: ReportRepository = new PgReportRepository();
    const tipRepository: TipRepository = new PgTipRepository();
    const createReportUsecase = new CreateReportUsecase(
        reportRepository,
        tipRepository
    );
    await createReportUsecase.execute({ userId, tipId: Number(id) });
    return NextResponse.json({ message: "Report created" }, { status: 200 });
}
