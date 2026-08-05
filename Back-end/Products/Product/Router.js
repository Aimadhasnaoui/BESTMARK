import express from "express";
const router = express.Router();
import { CreateProduct, GetProducts, GetProduct, UpdateProduct, DeleteProduct } from "./Controller.js";
import { uploadImage, optimizeImage } from "../../Midelwars/UploadImage.js";

router.route("/").post(uploadImage("image"), optimizeImage("products"), CreateProduct).get(GetProducts);
router
  .route("/:id")
  .get(GetProduct)
  .patch(uploadImage("image"), optimizeImage("products"), UpdateProduct)
  .delete(DeleteProduct);

export default router;
