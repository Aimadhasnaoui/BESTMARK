import express from "express";
const router = express.Router();
import {
  CreatePermissionModel,
  GetPermissionModels,
  GetPermissionModel,
  UpdatePermissionModel,
  DeletePermissionModel,
} from "./Controller.js";

router.route("/").post(CreatePermissionModel).get(GetPermissionModels);
router.route("/:id").get(GetPermissionModel).patch(UpdatePermissionModel).delete(DeletePermissionModel);

export default router;
