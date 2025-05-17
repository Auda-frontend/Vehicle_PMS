import nodemailer from 'nodemailer';
import fs from 'fs';
import path from 'path';
import { env } from '../config/env';

const transporter = nodemailer.createTransport({
    service: "Gmail",
    auth: {
        user: env.EMAIL_USER,
        pass: env.EMAIL_PASSWORD
    },
});

interface EmailOptions {
    to: string;
    subject: string;
    html: string;
}

export const sendEmail = async (options: EmailOptions) => {
    try {
        await transporter.sendMail({
            from: `"Parking System" <${env.EMAIL_USER}>`,
            ...options,
        });
    } catch (error) {
        console.error("Email failed:", error);
    }
};

export const sendSlotApprovalEmail = async (
    email: string,
    slotNumber: string,
    vehiclePlate: string
) => {
    const templatePath = path.join(__dirname, "../templates/slotApproved.html");
    const html = fs
        .readFileSync(templatePath, "utf-8")
        .replace("{{slotNumber}}", slotNumber)
        .replace("{{plateNumber}}", vehiclePlate);
    
    await sendEmail({
        to: email,
        subject: "Your Parking Slot has been Approved",
        html,
    });
};