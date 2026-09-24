import express from "express";
const router = express.Router();
import {
  CreatePayslip,
  GetPayslips,
  GetEmployeePayslips,
  GetPayslip,
  UpdatePayslip,
  DeletePayslip,
} from "./Controller.js";

router.route("/").post(CreatePayslip).get(GetPayslips);
router.get("/employee/:id", GetEmployeePayslips);
router.route("/:id").get(GetPayslip).patch(UpdatePayslip).delete(DeletePayslip);

export default router;
