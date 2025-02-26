import { CreateTicketDto } from "../ticket/dto/CreateTicketDto";

export interface CreateSpotDto {
  name: string;
  address: string;
  lon: number;
  lat: number;
  phone: string;
  info?: string | null;
  category: string;
  link?: string | null;
  img: string;
  avgPrice?: number | null;
  avgWaitingTime?: number | null;
  tickets?: CreateTicketDto[];
}
