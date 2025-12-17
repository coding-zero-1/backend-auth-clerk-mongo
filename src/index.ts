import express from "express";
import userRouter from "./routes/userRoutes";
import connectDB from "./config/dbConfig";
import cors from "cors";

const app = express();
const PORT = process.env.PORT;
app.use(
  cors({
    origin: process.env.CLIENT_URL,
    methods: ["GET", "POST", "HEAD", "PUT", "DELETE"],
    credentials: true,
  })
);
app.use(express.json());

app.use("/api/v1/user", userRouter);

app.listen(PORT, () => {
  if (!process.env.MONGO_URI) {
    console.error("MONGO_URI is not defined in environment variables");
    process.exit(1);
  }
  connectDB(process.env.MONGO_URI);
  console.log(`Server is running on port ${PORT}`);
});