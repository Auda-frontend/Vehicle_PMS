import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import { setupSwagger } from './utils/swagger';
import { notFoundHandler, errorHandler } from './middleware/errorMiddleware';
import authRoutes from './routes/authRoutes';
import vehicleRoutes from './routes/vehicleRoutes';
import slotRoutes from './routes/slotRoutes';
import requestRoutes from './routes/requestRoutes';
import statsRoutes from "./routes/statsRoute";
import paymentRoutes from "./routes/paymentRoutes";

const app = express();

const authLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 50, // Limit each IP to 50 requests per Window
    message: "Too many attempts, please try again later",
});

//Middleware
app.use(cors());
app.use(express.json());
app.use(helmet());

setupSwagger(app);

//Routes
app.use("/api/v1/auth", authLimiter, authRoutes);
app.use("/api/v1/vehicles", vehicleRoutes);
app.use("/api/v1/admin/slots", slotRoutes);
app.use("/api/v1/requests", requestRoutes);
app.use("/api/v1/admin", statsRoutes);
app.use('/api/v1/payments', paymentRoutes);

//Health Check
app.get('/health', (req, res) => {
    res.status(200).json({ status: 'OK' });
});

//Error handling
app.use(notFoundHandler);
app.use(errorHandler);

export default app;