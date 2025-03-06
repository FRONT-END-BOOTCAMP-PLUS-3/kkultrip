import { Image } from "@prisma/client";
export interface ImageRepository {
    createImages(tipId: number, imageFiles: File[]): Promise<void>;
    getImagesByTipId(tipId: number): Promise<string[]>;
    deleteImagesByPaths(imagePaths: string[]): Promise<void>;
    getImageByTipId(tipId: number): Promise<Image[]>;
}
