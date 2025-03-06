import { Docent } from "@prisma/client";

export interface DocentRepository {
  createDocent(data: Docent): Promise<Docent>;
  updateDocent(id: number, data: Docent): Promise<Docent>;
  getDocentBySpotId(spotId: number): Promise<Docent[] | null>;
}
