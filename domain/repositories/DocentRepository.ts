import { Docent } from "@prisma/client";

export default interface DocentRepository {
  createDocent(data: Docent): Promise<Docent>;
  updateDocent(id: number, data: Docent): Promise<Docent>;
  getDocentBySpotId(spotId: number): Promise<Docent[] | null>;
  deleteDocent(id: number): Promise<Docent | null>;
}
