export interface GetSpotsDTO {
  id: number;
  name: string;
  category: string;
  lat: number;
  lon: number;
  img: string;
  avgPrice: number | null;
  bookmarkCnt: number;
  tipCnt: number;
  time?: string; // 오늘 영업시간
}
