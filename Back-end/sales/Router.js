import express from "express";
const router = express.Router();
import { CreateSale, GetSales, GetSale, UpdateSale, DeleteSale } from "./Controller.js";

router.route("/").post(CreateSale).get(GetSales);
router.route("/:id").get(GetSale).patch(UpdateSale).delete(DeleteSale);

export default router;
