import express from "express";
const router = express.Router();
import { CreateTransaction, GetTransactions, GetTransaction, UpdateTransaction, DeleteTransaction } from "./Controller.js";

router.route("/").post(CreateTransaction).get(GetTransactions);
router.route("/:id").get(GetTransaction).patch(UpdateTransaction).delete(DeleteTransaction);

export default router;