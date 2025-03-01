import { prisma } from "@/lib/prisma";
import { Reaction } from "@prisma/client";

export default class PgReactionRepository {
    async getReactionByTipId(tipId: number): Promise<Reaction[]> {
        return await prisma.reaction.findMany({ where: { tipId } });
    }
}
