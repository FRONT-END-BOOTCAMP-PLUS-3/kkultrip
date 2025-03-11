import { GetUserListDto } from "./GetUserListDto";

export interface UserListDto {
  users: GetUserListDto[];
  totalCount: number;
  totalPages: number;
  hasPreviousPage: boolean;
  hasNextPage: boolean;
  pages: number[];
}
