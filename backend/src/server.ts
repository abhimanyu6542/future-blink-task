import "./config/env"; // must be first — loads dotenv before anything else reads process.env
import express from "express";
import cors from "cors";
import { connectDB } from "./config/db";
import { PORT } from "./config/constants";
import conversationRoutes from "./routes/conversation.routes";

const app = express();

app.use(cors());
app.use(express.json());

app.use("/api", conversationRoutes);

connectDB().then(() => {
  app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
});
