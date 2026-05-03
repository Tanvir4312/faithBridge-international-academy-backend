import express from "express";
import { ChatController } from "./chat.controller";

const router = express.Router();

// The POST route that useChat will call
router.post("/", ChatController.handleChat);

export const ChatRoutes = router;
