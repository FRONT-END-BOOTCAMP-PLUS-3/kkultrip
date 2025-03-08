export interface GetUserListDto {
  id: number;
  is_admin: boolean;
  nickname: string;
  created_at: Date;
  updated_at: Date;
  email: string;
}
