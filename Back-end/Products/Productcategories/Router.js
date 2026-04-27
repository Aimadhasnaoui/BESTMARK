import express from "express";
const router = express.Router();
import { CreateCategory, GetCategories, GetCategory, UpdateCategory, DeleteCategory } from "./Controller.js";

router.route("/").post(CreateCategory).get(GetCategories);
router.route("/:id").get(GetCategory).patch(UpdateCategory).delete(DeleteCategory);

export default router;
