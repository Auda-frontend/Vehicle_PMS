import { User } from '../../generated/prisma';

export type AuthPayload = {
    email: string;
    password: string;
};

export type UserResponse = Omit<User, "password"> & {
    token: string;
}