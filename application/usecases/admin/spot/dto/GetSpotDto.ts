import { GetTicketDto } from "../ticket/dto/GetTicketDto";

export interface GetSpotDto {
  id: number;
  name: string;
  address: string;
  lon: number;
  lat: number;
  phone: string;
  info: string | null;
  category: string;
  link: string | null;
  img: string;
  avgPrice: number | null;
  avgWaitingTime: number | null;
  tickets: GetTicketDto[]; // 추가
  createdAt: string;
  updatedAt: string;
}
