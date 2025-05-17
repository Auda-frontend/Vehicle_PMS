import { Request, Response } from "express";
import * as slotService from "../services/slotService"
import { bulkCreateSchema, updateSlotSchema } from "../validations/slotValidation";

export const bulkCreate = async (req: Request, res: Response) => {
    try {
        const slots = bulkCreateSchema.parse(req.body.slots);
        const result = await slotService.bulkCreateSlots(slots);

        res.status(201).json({ created: result.count });
    } catch (error: any) {
        res.status(400).json({ message: error.message });
    }
};

export const listSlots = async (req: Request, res: Response) => {
    try {
        const result = await slotService.listSlots(req.query);

        res.status(200).json(result);
    } catch (error: any) {
        res.status(500).json({ message: error.message });
    }
};

export const updateSlot = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const validatedData = updateSlotSchema.parse(req.body);
        const slot = await slotService.updateSlot(id, validatedData);

        res.status(200).json(slot);
    } catch (error: any) {
        res.status(400).json({ message: error.message });
    }
};

export const deleteSlot = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        await slotService.deleteSlot(id);

        res.status(204).send();
    } catch (error: any) {
        res.status(400).json({ message: error.message });
    }
};