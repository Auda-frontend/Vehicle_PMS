import { z } from "zod";

export const createSlotSchema = z.object({
    slotNumber: z.string(),
    size: z.enum(["small", "medium", "large"]),
    vehicleType: z.enum(["car", "motorcycle", "truck"]),
    location: z.enum(["north", "south", "east", "west"]).optional(),
    status: z.enum(["available", "unavailable"]),
});

export const bulkCreateSchema = z.array(createSlotSchema);
export const updateSlotSchema = createSlotSchema.partial();