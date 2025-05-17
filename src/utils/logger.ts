import { error, info } from "console";
import { logAction } from "../services/logService";

export const logger = {
    info: (userId: string | null, action: string, metadata?: any) => {
        console.log(`[INFO] ${action}`, metadata);
        return logAction(userId, action as any, metadata);
    },
    error: (userId: string | null, action: string, error: Error) => {
        console.error(`[ERROR] ${action}`, error);
        return logAction(userId, action as any, {
            error: error.message,
            stack: error.stack
        });
    },
};