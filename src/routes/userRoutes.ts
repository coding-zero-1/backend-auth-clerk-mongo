import { Router } from "express";
import { clerkWebhookController } from "../controllers/userControllers";

const userRouter = Router();

userRouter.post("/webhook", clerkWebhookController);

export default userRouter;