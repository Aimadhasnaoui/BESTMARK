import express from "express";
const router = express.Router();
import { CreateEmployee, GetEmployees, GetEmployee, UpdateEmployee, DeleteEmployee } from "./Controller.js";
import {ChnageUserPaword} from './AuthEmployee.js'

router.route("/").post(CreateEmployee).get(GetEmployees);
router.route("/:id").get(GetEmployee).patch(UpdateEmployee).delete(DeleteEmployee);
router.put('/password/:id',ChnageUserPaword)

export default router;
