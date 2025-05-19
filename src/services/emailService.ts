import nodemailer from 'nodemailer';
import { generateReceiptText, generateReceiptHTML } from '../utils/receiptTemplate';
import { PrismaClient } from '../../generated/prisma';

const prisma = new PrismaClient();

export async function sendReceiptEmail(requestId: string) {
  try {
    const request = await prisma.slotRequest.findUnique({
      where: { id: requestId },
      include: { user: true }
    });

    if (!request || !request.user) {
      throw new Error('Request or user not found');
    }

    const transporter = nodemailer.createTransport({
      service: 'Gmail',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
      }
    });

    const mailOptions = {
      from: `"Parking System" <${process.env.EMAIL_USER}>`,
      to: request.user.email,
      subject: `Parking Receipt #${request.id.slice(0, 8).toUpperCase()}`,
      text: generateReceiptText(request),
      html: generateReceiptHTML(request)
    };

    await transporter.sendMail(mailOptions);

    await prisma.slotRequest.update({
      where: { id: requestId },
      data: { receiptSent: true }
    });

    return true;
  } catch (error) {
    console.error('Error sending email:', error);
    return false;
  }
}

export async function sendPaymentConfirmation(requestId: string) {
  try {
    const request = await prisma.slotRequest.findUnique({
      where: { id: requestId },
      include: { user: true }
    });

    if (!request || !request.user) {
      throw new Error('Request or user not found');
    }

    const transporter = nodemailer.createTransport({
      service: 'Gmail',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
      }
    });

    const mailOptions = {
      from: `"Parking System" <${process.env.EMAIL_USER}>`,
      to: request.user.email,
      subject: `Payment Confirmation #${request.id.slice(0, 8).toUpperCase()}`,
      text: `Your payment of ${request.amountDue} RWF has been confirmed. Thank you!`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #333; text-align: center;">PAYMENT CONFIRMATION</h2>
          <hr style="border: 1px solid #ddd;">
          <p>Your payment for parking receipt #${request.id.slice(0, 8).toUpperCase()} has been confirmed.</p>
          <p><strong>Amount Paid:</strong> ${request.amountDue} RWF</p>
          <p><strong>Payment Method:</strong> ${request.paymentMethod}</p>
          <hr style="border: 1px solid #ddd;">
          <p style="text-align: center;">Thank you for your payment!</p>
        </div>
      `
    };

    await transporter.sendMail(mailOptions);
    return true;
  } catch (error) {
    console.error('Error sending payment confirmation:', error);
    return false;
  }
}