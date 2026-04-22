import dotenv from "dotenv";
import express, { Application, Request, Response } from "express";
import connectDB from "./config/db";
import dns from "dns";
import User from "./model/User";

dotenv.config();
dns.setServers(["1.1.1.1", "8.8.8.8"]);

const app: Application = express();

connectDB();

app.use(express.json());

app.get("/", (_req: Request, res: Response) => {
  res.send("MongoDB Atlas Connected 🚀");
});

app.post("/api/register", async (req: Request, res: Response) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({
        message: "Please provide name, email and password",
      });
    }

    const userExists = await User.findOne({ email });

    if (userExists) {
      return res.status(400).json({
        message: "User already exists",
      });
    }

    const user = await User.create({ name, email, password });

    res.status(201).json({
      message: "User registered successfully",
      user,
    });
  } catch (error) {
    res.status(500).json({ message: (error as Error).message });
  }
});

app.listen(process.env.PORT, () => {
  console.log(`Server running on port ${process.env.PORT}`);
});