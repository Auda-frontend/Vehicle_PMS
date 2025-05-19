import { PrismaClient } from "../../generated/prisma";
import { findCompatibleSlot } from "../utils/slotAssignment";
import { sendSlotApprovalEmail } from "./notificationService";
import { logger } from "../utils/logger";

const prisma = new PrismaClient();

export const createRequest = async (input: {
  userId: string;
  vehicleId: string;
  plateNumber: string;
  duration?: number;
}) => {
  try {
    const request = await prisma.slotRequest.create({
      data: {
        userId: input.userId,
        vehicleId: input.vehicleId,
        plateNumber: input.plateNumber,
        duration: input.duration,
        entryTime: new Date(),
        status: "pending"
      },
    });
    
    await logger.info(
      input.userId,
      "request_created",
      { requestId: request.id, vehicleId: input.vehicleId }
    );
    
    return request;
  } catch (error) {
    await logger.error(
      input.userId,
      "request_creation_failed",
      error instanceof Error ? error : new Error(String(error))
    );
    throw error;
  }
};

export const approveRequest = async (requestId: string, slotId?: string) => {
  let request;
  try {
    request = await prisma.slotRequest.findUnique({
      where: { id: requestId },
      include: { 
        vehicle: true,
        user: { select: { email: true } }
      },
    });

    if (!request) throw new Error("Request not found");

    // Auto-assign if no slotId provided
    const assignedSlotId = slotId || (await findCompatibleSlot(request.vehicleId))?.id;
    if (!assignedSlotId) throw new Error("No compatible slots available");

    const assignedSlot = await prisma.parkingSlot.findUnique({
      where: { id: assignedSlotId }
    });

    const result = await prisma.$transaction([
      prisma.slotRequest.update({
        where: { id: requestId },
        data: { status: "approved", slotId: assignedSlotId },
      }),
      prisma.parkingSlot.update({
        where: { id: assignedSlotId },
        data: { status: "unavailable" },
      }),
    ]);

    // Log and notify after successful transaction
    await logger.info(
      request.userId,
      "request_approved",
      { 
        requestId,
        slotId: assignedSlotId,
        vehicleId: request.vehicleId
      }
    );

    if (request.user.email && assignedSlot) {
      await sendSlotApprovalEmail(
        request.user.email,
        assignedSlot.slotNumber,
        request.vehicle.plateNumber
      ).catch(e => console.error("Email failed:", e));
    }

    return result;
  } catch (error) {
    await logger.error(
      request?.userId || null,
      "request_approval_failed",
      error instanceof Error ? error : new Error(String(error))
    );
    throw error;
  }
};

export const rejectRequest = async (requestId: string, reason?: string) => {
  try {
    const request = await prisma.slotRequest.update({
      where: { id: requestId },
      data: {
        status: "rejected",
        rejectionReason: reason
      },
      include: {
        user: { select: { id: true } }
      }
    });

    await logger.info(
      request.user.id,
      "request_rejected",
      { 
        requestId,
        reason: reason || "No reason provided"
      }
    );

    return request;
  } catch (error) {
    await logger.error(
      null,
      "request_rejection_failed",
      error instanceof Error ? error : new Error(String(error))
    );
    throw error;
  }
};

export const listRequests = async (
  userId?: string, 
  filters: {
    status?: string;
    page?: number;
    limit?: number;
  } = {}
) => {
  try {
    const { status, page = 1, limit = 10 } = filters;
    const where = {
      ...(userId && { userId }),
      ...(status && { status }),
    };

    const [requests, total] = await Promise.all([
      prisma.slotRequest.findMany({
        where,
        include: {
          vehicle: true,
          slot: true,
          user: { select: { name: true, email: true } }
        },
        skip: (page - 1) * limit,
        take: limit,
        orderBy: { createdAt: 'desc' },
      }),
      prisma.slotRequest.count({ where }),
    ]);

    await logger.info(
      userId || null,
      "requests_listed",
      { filterUserId: userId, status, page, limit }
    );

    return {
      data: requests,
      meta: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    };
  } catch (error) {
    await logger.error(
      userId || null,
      "request_listing_failed",
      error instanceof Error ? error : new Error(String(error))
    );
    throw error;
  }
};

export const deleteRequest = async (requestId: string, userId: string) => {
  try {
    // Find the request and verify it belongs to the user
    const request = await prisma.slotRequest.findUnique({
      where: { id: requestId },
      include: { user: { select: { id: true } } },
    });

    if (!request) throw new Error("Request not found");
    if (request.userId !== userId) throw new Error("Unauthorized: You can only delete your own requests");
    if (request.status !== "pending") throw new Error("Only pending requests can be deleted");

    // Delete the request
    await prisma.slotRequest.delete({
      where: { id: requestId },
    });

    await logger.info(
      userId,
      "request_deleted",
      { requestId }
    );

    return { message: "Request deleted successfully" };
  } catch (error) {
    await logger.error(
      userId,
      "request_deletion_failed",
      error instanceof Error ? error : new Error(String(error))
    );
    throw error;
  }
};