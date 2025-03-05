import ReportRepository from "@/domain/repositories/ReportRepository";
import { CreateReportDto } from "./dto/CreateReportDto";
export class CreateReportUsecase {
    constructor(private reportRepository: ReportRepository) {}

    async execute(createReportDto: CreateReportDto): Promise<void> {
        await this.reportRepository.createReport({
            tipId: createReportDto.tipId,
            userId: createReportDto.userId,
            createdAt: new Date(),
        });
    }
}
