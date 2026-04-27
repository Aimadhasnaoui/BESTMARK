import express from "express";
const router = express.Router();
import { CreatePurchase, GetPurchases, GetPurchase, UpdatePurchase, DeletePurchase } from "./Controller.js";

router.route("/").post(CreatePurchase).get(GetPurchases);
router.route("/:id").get(GetPurchase).patch(UpdatePurchase).delete(DeletePurchase);

export default router;
