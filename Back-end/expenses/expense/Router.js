import express from "express";
const router = express.Router();
import { CreateExpense, GetExpenses, GetExpense, UpdateExpense, DeleteExpense } from "./Controller.js";

router.route("/").post(CreateExpense).get(GetExpenses);
router.route("/:id").get(GetExpense).patch(UpdateExpense).delete(DeleteExpense);

export default router;
