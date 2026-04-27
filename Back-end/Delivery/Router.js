import express from "express";
const router = express.Router();
import { CreateDelivery, GetDeliveries, GetDelivery, UpdateDelivery, DeleteDelivery } from "./Controller.js";

router.route("/").post(CreateDelivery).get(GetDeliveries);
router.route("/:id").get(GetDelivery).patch(UpdateDelivery).delete(DeleteDelivery);

export default router;
