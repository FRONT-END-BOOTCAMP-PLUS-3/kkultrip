export interface GetUserDto {
  id: string;
  isAdmin: boolean;
  img: string;
  nickname: string;
  createdAt: Date;
  updatedAt: Date;
  email: string;
}
