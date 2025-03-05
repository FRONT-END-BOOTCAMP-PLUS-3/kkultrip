import { prisma } from "@/lib/prisma";
import UserRepository from "@/domain/repositories/UserRepository";
import { User } from "@prisma/client";

export default class PgUserRepository implements UserRepository {
    async getUserById(id: string) : Promise<User | null> {
        return await prisma.user.findUnique({ where: { id } });
    }
}
