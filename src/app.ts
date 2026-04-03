import express, { Application, Request, Response } from "express";
import { IndexRoutes } from "./app/route";
import { globalErrorHandler } from "./app/middlewares/globalErrorHandler";
import cookieParser from "cookie-parser";
import { toNodeHandler } from "better-auth/node";
import { auth } from "./app/lib/auth";
import path from "path";
import { envVars } from "./app/config/env";
import cors from "cors";

const app: Application = express();

app.set("view engine", "ejs");
app.set("views", path.resolve(process.cwd(), `src/app/templates`));
app.use(
  cors({
    origin: [
      envVars.FRONTEND_URL as string,
      envVars.BETTER_AUTH_URL as string,
      "http://localhost:3000",
      "http://localhost:5000",
    ],
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH"],
    allowedHeaders: ["Content-Type", "Authorization"],
  }),
);

app.use("/api/auth", toNodeHandler(auth));
// Enable URL-encoded form data parsing
app.use(express.urlencoded({ extended: true }));

// Middleware to parse JSON bodies
app.use(express.json());
app.use(cookieParser());

app.use("/api/v1", IndexRoutes);

// Global error handler
app.use(globalErrorHandler);

// Basic route
app.get("/", (req: Request, res: Response) => {
  res.send("Hello, TypeScript + Express!");
});

export default app;
