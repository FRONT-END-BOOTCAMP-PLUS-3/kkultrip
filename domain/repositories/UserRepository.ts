import { User } from "@prisma/client";
import { CreateUserDto } from "@/application/usecases/user/dto/CreateUserDto";

export interface UserRepository {
  createUser(user: CreateUserDto): Promise<User>;
}
