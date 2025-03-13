import { User } from "@prisma/client";

export default interface UserRepository {
  createUser(user: User): Promise<void>;
  findByEmail(email: string): Promise<User | null>;
  findByNickname(nickname: string): Promise<User | null>;
  getUserById(id: string): Promise<User | null>;
  getAllUsers(): Promise<User[] | null>;
  updateUserRole(id: string, isAdmin: boolean): Promise<void>;
  deleteUser(id: string): Promise<void>;
  getUserByName(nickname: string): Promise<User | null>;
  getUserIdByNickname(nickname: string): Promise<{ id: string } | null>;
<<<<<<< HEAD
  getUsersByPartialName(name: string): Promise<User[] | null>;
=======
  updateUser(id: string, nickname: string, img: string): Promise<void>;
>>>>>>> 9023e26b5b5746e1370a53f0be97dd3d3ef24d67
}
