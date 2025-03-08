import { GetSpotListDto } from "./GetSpotListDto";

export interface SpotListDto {
  spots: GetSpotListDto[]; // GetSpotListDto의 배열
  totalCount: number;
  totalPages: number;
  hasPreviousPage: boolean;
  hasNextPage: boolean;
  pages: number[];
}
