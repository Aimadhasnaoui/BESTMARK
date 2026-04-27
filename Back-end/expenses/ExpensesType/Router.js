import express from "express";
const router = express.Router();
import { CreateExpenseType, GetExpenseTypes, GetExpenseType, UpdateExpenseType, DeleteExpenseType } from "./Controller.js";

router.route("/").post(CreateExpenseType).get(GetExpenseTypes);
router.route("/:id").get(GetExpenseType).patch(UpdateExpenseType).delete(DeleteExpenseType);

export default router;
