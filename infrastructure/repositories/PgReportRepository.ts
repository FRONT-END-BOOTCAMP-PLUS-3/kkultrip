import ReportRepository from "@/domain/repositories/ReportRepository";
import { prisma } from "@/lib/prisma";
import { Report } from "@prisma/client";

export class PgReportRepository implements ReportRepository {
    async createReport(report: Report): Promise<void> {
        await prisma.report.create({
            data: {
                tipId: report.tipId,
                userId: report.userId,
            },
        });
    }
}
