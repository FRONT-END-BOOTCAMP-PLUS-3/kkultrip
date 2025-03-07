import ReportRepository from "@/domain/repositories/ReportRepository";
import { prisma } from "@/lib/prisma";
import { Report } from "@prisma/client";

export class PgReportRepository implements ReportRepository {
  async createReport(report: Report): Promise<void> {
    try {
      await prisma.report.create({
        data: {
          tipId: report.tipId,
          userId: report.userId,
        },
      });
    } catch (error) {
      console.error("❌ createReport 오류 발생:", error);
      throw new Error("신고 생성 중 오류가 발생했습니다.");
    } finally {
      await prisma.$disconnect();
    }
  }
}
