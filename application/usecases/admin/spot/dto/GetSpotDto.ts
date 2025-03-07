import { GetDocentDto } from "../docent/dto/GetDocentDto";
import { GetTicketDto } from "../ticket/dto/GetTicketDto";
import { GetTimeDto } from "../time/dto/GetTimeDto";

export interface GetSpotDto {
  id: number;
  name: string;
  address: string;
  lon: number;
  lat: number;
  phone: string | null;
  info: string | null;
  category: string;
  link: string | null;
  img: string;
  tickets: GetTicketDto[] | null;
  times: GetTimeDto[] | null;
  docents: GetDocentDto[] | null;
}
