import express from "express";
const router = express.Router();
import { CreateProduct, GetProducts, GetProduct, UpdateProduct, DeleteProduct } from "./Controller.js";

router.route("/").post(CreateProduct).get(GetProducts);
router.route("/:id").get(GetProduct).patch(UpdateProduct).delete(DeleteProduct);

export default router;
