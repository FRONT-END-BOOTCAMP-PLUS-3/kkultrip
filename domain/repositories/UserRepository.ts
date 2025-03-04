import { User } from "@prisma/client";

export interface UserRepository {
  createUser(user: User): Promise<void>;
}
