import { Docent } from "@prisma/client";
import { DocentRepository } from "@/domain/repositories/DocentRepository";

export class DeleteDocentUseCase {
  constructor(private docentRepository: DocentRepository) {}

  async execute(docentId: number): Promise<Docent | null> {
    return this.docentRepository.deleteDocent(docentId);
  }
}
