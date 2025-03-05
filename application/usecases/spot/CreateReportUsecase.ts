import ReportRepository from "@/domain/repositories/ReportRepository";
import { CreateReportDto } from "./dto/CreateReportDto";
import TipRepository from "@/domain/repositories/TipRepository";
export class CreateReportUsecase {
    constructor(
        private reportRepository: ReportRepository,
        private tipRepository: TipRepository
    ) {}

    async execute(createReportDto: CreateReportDto): Promise<void> {
        await this.reportRepository.createReport({
            tipId: createReportDto.tipId,
            userId: createReportDto.userId,
            createdAt: new Date(),
        });
        await this.tipRepository.updateTipReportCount(createReportDto.tipId);
    }
}
