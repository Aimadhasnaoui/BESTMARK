import express from "express";
const router = express.Router();
import { CreateStockMovement, GetStockMovements, GetStockMovement, UpdateStockMovement, DeleteStockMovement } from "./Controller.js";

router.route("/").post(CreateStockMovement).get(GetStockMovements);
router.route("/:id").get(GetStockMovement).patch(UpdateStockMovement).delete(DeleteStockMovement);

export default router;
