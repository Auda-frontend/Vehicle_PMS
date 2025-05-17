import { PrismaClient } from "../../generated/prisma";

const prisma = new PrismaClient();

export const bulkCreateSlots = async (slots: any[]) => {
    return prisma.parkingSlot.createMany({
        data: slots,
        skipDuplicates: true,
    });
};

export const listSlots = async (filters: {
    page?: number;
    limit?: number;
    status?: string;
    size?: string;
}) => {
    const { page = 1, limit = 10, ...where } = filters;

    const [slots, total] = await Promise.all([
        prisma.parkingSlot.findMany({
            where,
            skip: (page - 1) * limit,
            take: limit,
        }),
        prisma.parkingSlot.count({ where }),
    ]);

    return {
        data: slots,
        meta: {
            total,
            page,
            limit,
            totalPages: Math.ceil(total / limit),
        },
    };
};

export const updateSlot = async (slotId: string, data: any) => {
    return prisma.parkingSlot.update({
        where: { id: slotId },
        data: {
            status: data.status,
            ...data
        },
    });
};

export const deleteSlot = async (slotId: string) => {
    return prisma.parkingSlot.delete({
        where: { id: slotId },
    });
};