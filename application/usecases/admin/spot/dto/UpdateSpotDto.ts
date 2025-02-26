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
}
