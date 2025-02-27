import { prisma } from "@/lib/prisma";
import { Docent } from "@prisma/client";
import DocentRepository from "@/domain/repositories/DocentRepository";

export default class PgDocentRepository implements DocentRepository {
    async getDocentBySpotId(spotId: number): Promise<Docent[] | null> {
        return prisma.docent.findMany({
            where: {
                spotId
            },
        });
    }
}
