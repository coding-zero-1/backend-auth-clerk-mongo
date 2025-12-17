import mongoose, { Document, Model } from "mongoose";

interface IUser extends Document {
  username: string;
  clerkId: string;
  email: string;
  profileUrl?: string;
}

const UserSchema = new mongoose.Schema<IUser>({
  username: { type: String, required: true, trim: true },
  clerkId: { type: String, required: true, unique: true },
  email: { type: String, required: true, unique: true },
  profileUrl: { type: String },
});

const UserModel: Model<IUser> = mongoose.models.users || mongoose.model<IUser>("users", UserSchema);

export default UserModel;