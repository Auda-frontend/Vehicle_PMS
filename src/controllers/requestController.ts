import { Request, Response } from "express";
import { z } from "zod";
import { ZodError } from "zod";
import * as requestService from "../services/requestService";
import { createRequestSchema, approveRequestSchema } from "../validations/requestValidation";
import { sendReceiptEmail } from "../services/emailService";
import { Prisma } from "../../generated/prisma";
import { PrismaClient } from "../../generated/prisma";

const prisma = new PrismaClient();

interface CreateRequestInput {
  userId: string;
  vehicleId: string;
  plateNumber: string;
  duration?: number;
}

export const createRequest = async (req: Request, res: Response) => {
    try {
        const user = (req as any).user;
        if (!user || !user.userId) {
            res.status(401).json({ 
                success: false,
                message: 'Unauthorized - Please log in' 
            });
        }

        const validatedData = createRequestSchema.parse(req.body);

        const request = await requestService.createRequest({
            userId: user.userId,
            vehicleId: validatedData.vehicleId,
            plateNumber: validatedData.plateNumber,
            duration: validatedData.duration
        });


        res.status(201).json({
            success: true,
            data: {
                requestId: request.id,
                plateNumber: request.plateNumber,
                status: request.status
            },
            message: 'Parking request created successfully'
        });

    } catch (error: unknown) {
        if (error instanceof ZodError) {
            res.status(400).json({
                success: false,
                message: 'Validation error',
                errors: error.errors.map((e) => ({
                    field: e.path.join('.'),
                    message: e.message
                }))
            });
        }

        if (error instanceof Prisma.PrismaClientKnownRequestError) {
            if (error.code === 'P2002') {
                res.status(409).json({
                    success: false,
                    message: 'Duplicate request detected'
                });
            }
        }

        if (error instanceof Error) {
            console.error('Error in createRequest:', error);
            res.status(500).json({
                success: false,
                message: error.message
            });
        }

        res.status(500).json({
            success: false,
            message: 'Failed to create parking request'
        });
    }
};

export const approveRequest = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const { slotId } = approveRequestSchema.parse(req.body);
        const result = await requestService.approveRequest(id, slotId);

        res.status(200).json(result);
    } catch (error: any) {
        res.status(400).json({ message: error.message });
    }
};

export const rejectRequest = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const { reason } = req.body;

        const request = await requestService.rejectRequest(id, reason);

        res.status(200).json(request);
    } catch (error: any) {
        res.status(400).json({ message: error.message });
    }
};

export const listRequests = async (req: Request, res: Response) => {
    try {
        const { userId, role } = (req as any).user;
        const { status, page, limit } = req.query;

        //Admins can seel all requests, users can only see their own
        const filterUserId = role === 'admin' ? undefined : userId;

        const result = await requestService.listRequests(filterUserId, {
            status: status?.toString(),
            page: page ? parseInt(page.toString()) : 1,
            limit: limit ? parseInt(limit.toString()) : 10,
        });

        res.status(200).json(result);
    } catch (error: any) {
        res.status(500).json({ message: error.message });
    }
};


export const handleExit = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const request = await prisma.slotRequest.findUnique({ where: { id } });

    if (!request) {
      res.status(404).json({ error: 'Request not found' });
      return;
    }

    const exitTime = new Date();
    const entryTime = new Date(request.entryTime);
    const hours = Math.ceil((exitTime.getTime() - entryTime.getTime()) / (1000 * 60 * 60));
    const amountDue = hours * 1000;

    const updated = await prisma.slotRequest.update({
      where: { id },
      data: {
        exitTime,
        amountDue,
        status: 'completed',
      },
      include: {
        user: true,
        slot: true,
      },
    });

    await sendReceiptEmail(id);

    res.json(updated);
  } catch (error) {
    console.error('Error in handleExit:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const getRequest = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const request = await prisma.slotRequest.findUnique({
      where: { id },
      include: { user: true, slot: true },
    });

    if (!request) {
      res.status(404).json({ error: 'Request not found' });
      return;
    }

    res.json(request);
  } catch (error) {
    console.error('Error in getRequest:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const deleteRequest = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const userId = (req as any).user?.id; 
    if (!userId) {
      res.status(401).json({ message: "Unauthorized: User not authenticated" });
    }

    const result = await requestService.deleteRequest(id, userId);

    res.status(200).json(result); 
  } catch (error: any) {
    res.status(400).json({ message: error.message });
  }
};
