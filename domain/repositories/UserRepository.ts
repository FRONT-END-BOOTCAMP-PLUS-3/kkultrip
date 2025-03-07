import { User } from "@prisma/client";

export interface UserRepository {
  createUser(user: User): Promise<void>;
  findByEmail(email: string): Promise<User | null>;
  getUserById(id: string): Promise<User | null>;
}
