import { User } from "@prisma/client";

export default interface UserRepository {
  getUserById(id: string): Promise<User | null>;
}
