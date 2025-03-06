import { Docent } from "@prisma/client";

export interface DocentRepository {
  createDocent(data: Docent): Promise<Docent>;
}
