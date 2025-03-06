import { Image } from "@prisma/client";

export default interface ImageRepository {
    getImageByTipId(tipId: number): Promise<Image[]>;
}
