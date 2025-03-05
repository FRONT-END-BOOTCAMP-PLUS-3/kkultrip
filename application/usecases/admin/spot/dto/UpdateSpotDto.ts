import { UpdateTicketDto } from "../ticket/dto/UpdateTicketDto";
import { UpdateTimeDto } from "../time/dto/UpdateTimeDto";

export interface UpdateSpotDto {
  name?: string;
  address?: string;
  lon?: number;
  lat?: number;
  phone?: string;
  info?: string;
  category?: string;
  link?: string | null;
  img?: string;
  avgPrice?: number;
  avgWaitingTime?: number;
  tickets?: UpdateTicketDto[];
  times?: UpdateTimeDto[];
  updatedAt?: Date;
}
