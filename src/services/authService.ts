import { PrismaClient } from "../../generated/prisma";
import { hashPassword, comparePasswords } from "../utils/bcrypt";
import { generateToken } from "../utils/jwt";
import { AuthPayload, UserResponse } from "../models/userTypes";

const prisma = new PrismaClient();

export const userByRole = {
    async findUserByRole(role: string) {
        return await prisma.user.findFirst({ where: { role } });
    }
}

export const registerUser = async (
    payload: AuthPayload & { name: string } & { role: string }
): Promise<UserResponse> => {
    const { email, password, name, role } = payload;

    const existingUser = await prisma.user.findUnique({ where: { email } });
    if (existingUser) throw new Error("Email already in use");

    const hashedPassword = await hashPassword(password);
    const user = await prisma.user.create({
        data: {
            email,
            password: hashedPassword,
            name,
            role: role || "user"
        },
    });

    const token = generateToken(user.id, user.role);
    const { password: _, ...userWithoutPassword } = user;

    return { ...userWithoutPassword, token };
};

export const loginUser = async (
    payload: AuthPayload
): Promise<UserResponse> => {
    const { email, password } = payload;

    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) throw new Error("Invalid credentials");

    const isMatch = await comparePasswords(password, user.password);
    if (!isMatch) throw new Error("Invalid credentials");

    const token = generateToken(user.id, user.role);
    const { password: _, ...userWithoutPassword } = user;

    return { ...userWithoutPassword, token };
};