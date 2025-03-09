import { GetTipListDto } from "./GetTipListDto";

export interface TipListDto {
  tips: GetTipListDto[];
  totalCount: number;
  totalPages: number;
  hasPreviousPage: boolean;
  hasNextPage: boolean;
  pages: number[];
}
