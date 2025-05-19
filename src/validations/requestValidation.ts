import { z } from "zod";

export const createRequestSchema = z.object({
  vehicleId: z.string().uuid("Invalid vehicle ID format"),
  plateNumber: z.string()
    .min(3, "Plate number must be at least 3 characters")
    .max(15, "Plate number cannot exceed 15 characters")
    .regex(/^[A-Z0-9-]+$/, "Only uppercase letters, numbers and hyphens allowed"),
  duration: z.number()
    .int("Duration must be a whole number")
    .min(1, "Minimum duration is 1 hour")
    .max(24, "Maximum duration is 24 hours")
    .optional(),
  specialRequests: z.string()
    .max(200, "Special requests cannot exceed 200 characters")
    .optional(),
  entryTime: z.string()
    .datetime({ offset: true })
    .optional()
}).refine(data => {
  return true;
}, {
  message: "Plate number doesn't match registered vehicle",
  path: ["plateNumber"]
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