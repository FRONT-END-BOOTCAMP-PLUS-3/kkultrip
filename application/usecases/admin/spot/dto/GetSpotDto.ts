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
  avgPrice: number | null;
  avgWaitingTime: number | null;
  tickets: GetTicketDto[];
  times: GetTimeDto[];
  createdAt: string;
  updatedAt: string;
}
