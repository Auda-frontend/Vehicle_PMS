import { z } from "zod";

const rwandanPlateRegex = /^RA[A-Z]{1}\d{3}[A-Z]{1}$/;

export const createVehicleSchema = z.object({
    plateNumber: z.string().regex(rwandanPlateRegex, "Plate must be in format RAA99X (e.g: RAC972U)"),
    vehicleType: z.enum(["car", "motorcycle", "truck"]),
    size: z.enum(["small", "medium", "large"]),
    color: z.string().optional(),
});

export const updateVehicleSchema = createVehicleSchema.partial();