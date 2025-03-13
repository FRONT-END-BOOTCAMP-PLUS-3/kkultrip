import { ImageRepository } from "@/domain/repositories/ImageRepository";

export default class DeleteImageUseCase {
  constructor(private imageRepository: ImageRepository) {}

  async execute(id: number): Promise<void> {
    await this.imageRepository.deleteImageById(id);
  }
}
