import type { Request, Response } from "express";
import { Webhook, WebhookVerificationError } from "svix";
import UserModel from "../models/userModel";

export async function clerkWebhookController(req: Request, res: Response) {
  try {
    if (!process.env.CLERK_WEBHOOK_SECRET) {
      return res.status(500).json({
        success: false,
        error: true,
        msg: "Internal server error, please try again later",
      });
    }
    const webhook = new Webhook(process.env.CLERK_WEBHOOK_SECRET);
    await webhook.verify(JSON.stringify(req.body), {
      "svix-id": req.headers["svix-id"] as string,
      "svix-timestamp": req.headers["svix-timestamp"] as string,
      "svix-signature": req.headers["svix-signature"] as string,
    });
    const { type, data } = req.body;
    switch (type) {
      case "user.created":
        const userData = {
          clerkId: data.id,
          email: data.email_addresses[0]?.email_address,
          firstName: data.first_name,
          photo: data.profile_image_url,
        };
        await UserModel.create(userData);
        res.status(201).json({
          success: true,
          error: false,
          msg: "User created successfully",
        });
        break;
      case "user.deleted":
        await UserModel.findOneAndDelete({ clerkId: data.id });
        res.status(200).json({
          success: true,
          error: false,
          msg: "User deleted successfully",
        });
        break;
      default:
        console.log("Unhandled event type:", type);
        res.status(200).json({
          success: false,
          error: true,
          msg: "Event received but not processed",
        });
        break;
    }
    return;
  } catch (error) {
    console.error("Error handling Clerk webhook:", error);
    if (error instanceof WebhookVerificationError) {
      return res.status(401).json({
        success: false,
        error: true,
        msg: "Webhook verification failure",
      });
    }

    return res.status(500).json({
      success: false,
      error: true,
      msg: "Internal server error, please try again later",
    });
  }
}