import express from "express";
const router = express.Router();
import { GetDashboard } from "./Controller.js";

router.get("/", GetDashboard);

export default router;
