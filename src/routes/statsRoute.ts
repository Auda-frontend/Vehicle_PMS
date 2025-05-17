import { Router } from "express";
import { authenticate, adminOnly } from "../middleware/authMiddleware";
import { getStats } from "../controllers/statsController";

const router = Router();

router.get("/stats", authenticate, adminOnly, getStats);

export default router;