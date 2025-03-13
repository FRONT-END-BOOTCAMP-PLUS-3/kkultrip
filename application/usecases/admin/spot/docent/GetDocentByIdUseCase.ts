import { GetDocentDto } from "./dto/GetDocentDto";
import DocentRepository from "@/domain/repositories/DocentRepository";

export class GetSpotByIdUseCase {
  constructor(private docentRepository: DocentRepository) {}

  async execute(id: number): Promise<GetDocentDto | null> {
    const docent = await this.docentRepository.getDocentById(id);
    if (!docent) return null;

    return {
      title: docent.title,
      description: docent.description,
      audioPath: docent.audioPath,
    };
  }
}
