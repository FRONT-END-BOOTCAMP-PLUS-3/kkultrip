import ImageRepository from "@/domain/repositories/ImageRepository";
import { prisma } from "@/lib/prisma";
import { Image } from "@prisma/client";

export default class PgImageRepository implements ImageRepository {
    async getImageByTipId(tipId: number): Promise<Image[]> {
        const images = await prisma.image.findMany({
            where: {
                tipId,
            },
        });
        return images;
    }
}
