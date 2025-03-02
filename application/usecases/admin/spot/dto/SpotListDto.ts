import { GetSpotDto } from "./GetSpotDto";

export interface SpotListDto {
  spots: GetSpotDto[];

  // 페이지네이션을 위한 데이터
  totalCount: number;
  totalPages: number;
  hasPreviousPage: boolean;
  hasNextPage: boolean;
  pages: number[];
}
