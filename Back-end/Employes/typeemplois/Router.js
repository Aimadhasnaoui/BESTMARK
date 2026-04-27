import express from "express";
const router = express.Router();
import { CreateEmployeeType, GetEmployeeTypes, GetEmployeeType, UpdateEmployeeType, DeleteEmployeeType } from "./Controller.js";

router.route("/").post(CreateEmployeeType).get(GetEmployeeTypes);
router.route("/:id").get(GetEmployeeType).patch(UpdateEmployeeType).delete(DeleteEmployeeType);

export default router;
