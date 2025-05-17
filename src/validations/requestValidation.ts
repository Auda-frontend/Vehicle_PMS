import { z } from "zod";

export const createRequestSchema = z.object({
    vehicleId: z.string().uuid(),
});

export const approveRequestSchema = z.object({
    slotId: z.string().uuid().optional(),
});

export const rejectRequestSchema = z.object({
    reason: z.string().optional(),
});

export const listRequestsSchema = z.object({
    status: z.enum(["pending", "approved", "rejected"]).optional(),
    page: z.number().int().positive().default(1),
    limit: z.number().int().positive().max(100).default(10),
});