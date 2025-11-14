import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs"
import { AppError } from "../../common/error";

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
            throw new AppError("Email already exist")
        }

        const hashed = await bcrypt.hash(data.password, 10)

        return this.prisma.user.create({
            data: {
                email: data.email,
                name: data.name,
                password: hashed
            },
            select: {
                email: true,
                name: true
            }
        })
    }

    async validateLogin(email: string, password: string) {
        const user = await this.prisma.user.findUnique({ where: { email } })
        if (!user) throw new AppError('Invalid credentials', 401)

        const match = await bcrypt.compare(password, user.password)
        if (!match) throw new AppError('Invalid credentials', 401)

        return user
    }
}