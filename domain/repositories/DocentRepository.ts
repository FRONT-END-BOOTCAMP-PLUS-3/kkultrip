import { Docent } from "@prisma/client";

export default interface DocentRepository {
    getDocentBySpotId(spotId: number): Promise<Docent[] | null>;
}
