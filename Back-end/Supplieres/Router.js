import express from "express";
const router = express.Router();
import { CreateSupplier, GetSuppliers, GetSupplier, UpdateSupplier, DeleteSupplier } from "./Controller.js";

router.route("/").post(CreateSupplier).get(GetSuppliers);
router.route("/:id").get(GetSupplier).patch(UpdateSupplier).delete(DeleteSupplier);

export default router;
