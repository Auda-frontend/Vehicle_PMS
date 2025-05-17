import { PrismaClient } from "../../generated/prisma";
import { CreateVehicleInput, UpdateVehicleInput } from "../models/vehicleTypes";

const prisma = new PrismaClient();

export const addVehicle = async (input: CreateVehicleInput) => {
    if (!input.userId) {
        throw new Error("User ID is required");
    }
    
    const existingVehicle = await prisma.vehicle.findUnique({
        where: { plateNumber: input.plateNumber },
    });

    if (existingVehicle) throw new Error("Plate number already registered");

    return prisma.vehicle.create({
        data: {
            plateNumber: input.plateNumber,
            vehicleType: input.vehicleType,
            size: input.size,
            color: input.color,
            user: {
                connect: { id: input.userId }
            }
        },
    });
};

export const getVehicles = async (userId: string, page: number, limit: number) => {
    return prisma.vehicle.findMany({
        where: { userId },
        skip: (page - 1) * limit,
        take: limit,
    });
};

export const updateVehicle = async (vehicleId: string, input: UpdateVehicleInput) => {
    return prisma.vehicle.update({
        where: { id: vehicleId },
        data: input,
    });
};

export const deleteVehicle = async (vehicleId: string) => {
    return prisma.vehicle.delete({ where: { id: vehicleId } });
};