import mongoose from "mongoose";

export async function connectDB(): Promise<void> {
  // Read lazily so dotenv.config() in server.ts has already populated process.env
  const MONGODB_URI = process.env.MONGODB_URI || "";

  try {
    await mongoose.connect(MONGODB_URI);
    console.log("MongoDB connected...");
  } catch (err) {
    console.error("MongoDB connection error:", err);
    process.exit(1);
  }
}
