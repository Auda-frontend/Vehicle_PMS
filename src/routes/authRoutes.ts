import { Router } from "express";
import { authenticate } from "../middleware/authMiddleware";
import { register, login, getProfile, registerAdmin } from "../controllers/authController";

const router = Router();

//Public routes
router.post("/register", register);
router.post("/login", login);

//Protected route (requires JWT)
router.get("/profile", authenticate, getProfile);

//Register admin
router.post("/register-admin", authenticate, registerAdmin);

export default router;