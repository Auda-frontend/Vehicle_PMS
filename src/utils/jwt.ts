import jwt from 'jsonwebtoken';
import { env } from '../config/env';

export const generateToken = (userId: string, role: string): string => {
    return jwt.sign({ userId, role }, env.JWT_SECRET, { expiresIn: "1D" });
};

export const verifyToken = (token: string): jwt.JwtPayload => {
    return jwt.verify(token, env.JWT_SECRET) as jwt.JwtPayload;
}