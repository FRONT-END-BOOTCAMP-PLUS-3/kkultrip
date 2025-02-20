export interface User {
  id: string;
  kakaoId: number;
  nickname: string;
  isAdmin: boolean;
  img: string;
  createdAt: Date;
  updatedAt: Date;
}
