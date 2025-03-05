import { UpdateTicketDto } from "../ticket/dto/UpdateTicketDto";

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
  updatedAt?: Date;
}
