import express from "express";
const router = express.Router();
import {
  CreateEmployee,
  GetEmployees,
  GetEmployee,
  UpdateEmployee,
  DeleteEmployee,
} from "./Controller.js";
import { ChnageUserPaword, DesactiverAccount, me ,Logout} from "./AuthEmployee.js";
import { uploadImage, optimizeImage } from "../../Midelwars/UploadImage.js";

router.get("/me", me);
router.route("/").post(uploadImage("image"), optimizeImage("employees"), CreateEmployee).get(GetEmployees);
router
  .route("/:id")
  .get(GetEmployee)
  .patch(uploadImage("image"), optimizeImage("employees"), UpdateEmployee)
  .delete(DeleteEmployee);
router.put("/password/:id", ChnageUserPaword);
router.put("/Desactiver/Account/:id", DesactiverAccount);
router.post('/logout',Logout)

export default router;
