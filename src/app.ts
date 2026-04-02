import express, { Application, Request, Response } from "express";
import { IndexRoutes } from "./app/route";
import { globalErrorHandler } from "./app/middlewares/globalErrorHandler";

const app: Application = express();


// Enable URL-encoded form data parsing
app.use(express.urlencoded({ extended: true }));

// Middleware to parse JSON bodies
app.use(express.json());

app.use("/api/v1", IndexRoutes)

// Global error handler
app.use(globalErrorHandler);

// Basic route
app.get('/', (req: Request, res: Response) => {
  res.send('Hello, TypeScript + Express!');
});

export default app

