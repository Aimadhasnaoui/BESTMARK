import express from "express";
const router = express.Router();
import { CreatUser, GetUsers, GetUser, UpdateUser, DeleteUser } from "./Controller.js";

router.route("/").post(CreatUser).get(GetUsers);
router.route("/:id").get(GetUser).patch(UpdateUser).delete(DeleteUser);

export default router;