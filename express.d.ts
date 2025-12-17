declare module "express" {
    interface Request {
        clerkId?: string;
    }
}
export {};