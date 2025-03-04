import { CreateTicketDto } from "../ticket/dto/CreateTicketDto";
import { CreateTimeDto } from "../time/dto/CreateTimeDto";

export interface CreateSpotDto {
  name: string;
  address: string;
  lon: number;
  lat: number;
  phone?: string;
  info?: string;
  category: string;
  link?: string | null;
  img: string;
  avgPrice?: number | null;
  avgWaitingTime?: number | null;
  tickets?: CreateTicketDto[];
  times?: CreateTimeDto;
}
