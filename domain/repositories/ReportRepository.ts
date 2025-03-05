import { Report } from "@prisma/client";

export default interface ReportRepository {
    createReport(report: Report): Promise<void>;
}
