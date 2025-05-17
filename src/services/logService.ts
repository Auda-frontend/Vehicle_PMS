import { PrismaClient } from "../../generated/prisma";

const prisma = new PrismaClient();

type LogAction = 
    | "request_created"
    | "request_approved"
    | "request_rejected"
    | "slot_created"
    | "user_registered";

export const logAction = async (
    userId: string | null,
    action: LogAction,
    metadata?: any
) => {
    return prisma.auditLog.create({
        data: {
            userId: userId || undefined,
            action,
            metadata
        },
    });
};