import { ImageRepository } from "@/domain/repositories/ImageRepository";
import { GetImageListDTO } from "./dto/GetImageListDto";

export class GetImageListUseCase {
  constructor(private imageRepository: ImageRepository) {}

  async execute(): Promise<GetImageListDTO[]> {
    const images = await this.imageRepository.getAllImages();

    const imageList: GetImageListDTO[] = images.map((image) => ({
      id: image.id,
      tipId: image.tipId,
      path: image.path!,
      createdAt: image.createdAt,
    }));

    return imageList;
  }
}
