import { Vehicle } from "../../generated/prisma";

export type CreateVehicleInput = {
    plateNumber: string;
    vehicleType: "car" | "motorcycle" | "truck";
    size: "small" | "medium" | "large";
    color?: string;
    userId: string;
};

export type UpdateVehicleInput = Partial<CreateVehicleInput>;

export type VehicleResponse = Vehicle;