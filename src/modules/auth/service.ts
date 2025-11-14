import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs"

export class AuthService {
    constructor(
        private prisma: PrismaClient
    ){}

    async register(data: {
        email: string;
        name: string;
        password: string;
    }){
        const exist = await this.prisma.user.findUnique({
            where: { email: data.email }
        })

        if(exist){
            throw new Error("Email already exist")
        }

        const hashed = await bcrypt.hash(data.password, 10)

        return this.prisma.user.create({
            data: {
                email: data.email,
                name: data.name,
                password: hashed
            },
            select: {
                id: true,
                email: true,
                name: true
            }
        })
    }
}