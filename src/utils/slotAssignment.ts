import { PrismaClient } from "../../generated/prisma";

const prisma = new PrismaClient();

export const findCompatibleSlot = async (vehicleId: string) => {
    const vehicle = await prisma.vehicle.findUnique({
        where: { id: vehicleId },
        select: { vehicleType: true, size: true },
    });

    if (!vehicle) throw new Error("Vehicle not found");

    return prisma.parkingSlot.findFirst({
        where: {
            vehicleType: vehicle.vehicleType,
            size: vehicle.size,
            status: "available",
        },
    });
};