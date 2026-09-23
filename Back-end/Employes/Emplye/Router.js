import express from "express";
const router = express.Router();
import {
  CreateEmployee,
  GetEmployees,
  GetEmployee,
  UpdateEmployee,
  DeleteEmployee,
} from "./Controller.js";
import { ChnageUserPaword, DesactiverAccount, me ,Logout, GetMyPermissions} from "./AuthEmployee.js";
import { uploadImage, optimizeImage } from "../../Midelwars/UploadImage.js";
import { RequirePermission } from "../../Midelwars/RequirePermission.js";

// /me, /me/permissions and /logout stay open to any authenticated employee,
// regardless of the "Employés" permission (self-service).
router.get("/me", me);
router.get("/me/permissions", GetMyPermissions);
router.post('/logout',Logout)

router.use(RequirePermission("Employés"));

router.route("/").post(uploadImage("image"), optimizeImage("employees"), CreateEmployee).get(GetEmployees);
router
  .route("/:id")
  .get(GetEmployee)
  .patch(uploadImage("image"), optimizeImage("employees"), UpdateEmployee)
  .delete(DeleteEmployee);
router.put("/password/:id", ChnageUserPaword);
router.put("/Desactiver/Account/:id", DesactiverAccount);

export default router;
