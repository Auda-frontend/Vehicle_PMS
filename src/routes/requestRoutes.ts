import { Router } from "express";
import { authenticate, adminOnly } from "../middleware/authMiddleware";
import { createRequest, approveRequest, rejectRequest, listRequests } from "../controllers/requestController";

const router = Router();

//User routes
router.post("/", authenticate, createRequest);
router.get("/all-requests", authenticate, listRequests);

//Admin routes
router.patch("/:id/approve", authenticate, adminOnly, approveRequest);
router.patch("/:id/reject", authenticate, adminOnly, rejectRequest);

export default router;