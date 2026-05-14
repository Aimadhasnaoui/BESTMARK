import express from "express";
const router = express.Router();
import {
  CreateEmployee,
  GetEmployees,
  GetEmployee,
  UpdateEmployee,
  DeleteEmployee,
} from "./Controller.js";
import { ChnageUserPaword, DesactiverAccount, me } from "./AuthEmployee.js";

router.route("/").post(CreateEmployee).get(GetEmployees);
router
  .route("/:id")
  .get(GetEmployee)
  .patch(UpdateEmployee)
  .delete(DeleteEmployee);
router.get("/me", me);
router.put("/password/:id", ChnageUserPaword);
router.put("/Desactiver/Account/:id", DesactiverAccount);

export default router;
