import { Request, Response } from 'express';
import { sendPaymentConfirmation } from '../services/emailService';
import { PrismaClient } from '../../generated/prisma';

const prisma = new PrismaClient();

export const markAsPaid = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const { paymentMethod } = req.body;

    if (!paymentMethod || !['cash', 'momo', 'credit_card'].includes(paymentMethod)) {
      res.status(400).json({ error: 'Invalid payment method' }); // No return
      return;
    }

    const request = await prisma.slotRequest.findUnique({ where: { id } });

    if (!request) {
      res.status(404).json({ error: 'Request not found' }); // No return
      return;
    }

    if (request.status !== 'completed') {
      res.status(400).json({ error: 'Request is not ready for payment' }); // No return
      return;
    }

    const updated = await prisma.slotRequest.update({
      where: { id },
      data: {
        status: 'paid',
        paymentMethod,
      },
      include: {
        user: true,
        slot: true,
      },
    });

    await sendPaymentConfirmation(id);

    res.json(updated); 
  } catch (error) {
    console.error('Error in markAsPaid:', error);
    res.status(500).json({ error: 'Internal server error' }); // No return
  }
};

export const getPaymentHistory = async (req: Request, res: Response): Promise<void> => {
  try {
    const { userId } = req.params;
    const payments = await prisma.slotRequest.findMany({
      where: {
        userId,
        status: 'paid',
      },
      orderBy: {
        exitTime: 'desc',
      },
      include: {
        slot: true,
      },
    });

    res.json(payments);
  } catch (error) {
    console.error('Error in getPaymentHistory:', error);
    res.status(500).json({ error: 'Internal server error' }); // No return
  }
};