export interface Spot {
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
  createdAt: Date;
  updatedAt: Date;
}
