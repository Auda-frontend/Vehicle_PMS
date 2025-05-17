import { Router } from "express";
import { authenticate, adminOnly } from "../middleware/authMiddleware";
import { bulkCreate, listSlots, updateSlot, deleteSlot } from "../controllers/slotController";

const router = Router();

//Admin-only routes
router.post("/bulk", authenticate, adminOnly, bulkCreate);
router.get("/", authenticate, adminOnly, listSlots);
router.patch("/update/:id", authenticate, adminOnly, updateSlot);
router.delete("/delete/:id", authenticate, adminOnly, deleteSlot);

export default router;