import { Router } from "express";
import { authenticate } from "../middleware/authMiddleware";
import { createVehicle, listVehicles, updateVehicle, deleteVehicle } from "../controllers/vehicleController";

const router = Router();

//Protected routes (require JWT)
router.post("/", authenticate, createVehicle);
router.get("/all-vehicles", authenticate, listVehicles);
router.patch("/update/:id", authenticate, updateVehicle);
router.delete("/delete/:id", authenticate, deleteVehicle);

export default router;