import { User } from "@prisma/client";

export default interface UserRepository {
  createUser(user: User): Promise<void>;
  findByEmail(email: string): Promise<User | null>;
  getUserById(id: string): Promise<User | null>;
  getAllUsers(): Promise<User[] | null>;
  updateUserRole(id: string, isAdmin: boolean): Promise<void>;
  deleteUser(id: string): Promise<void>;
}
