import { PrismaClient } from "../../generated/prisma";

const prisma = new PrismaClient();

export const getSystemStats = async () => {
    const [users, slots, requests] = await Promise.all([
        prisma.user.count(),
        prisma.parkingSlot.count(),
        prisma.slotRequest.count(),
    ]);

    const availableSlots = await prisma.parkingSlot.count({
        where: { status: "available" },
    });

    return {
        users,
        slots,
        availableSlots,
        occupiedSlots: slots - availableSlots,
        requests,
        approvalRate: requests > 0
            ? (await prisma.slotRequest.count({
                where: { status: "approved" }
            })) / requests * 100
            : 0,
    };
};