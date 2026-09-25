import express from "express";
const router = express.Router();
import {
  CreateNotification,
  GetMyNotifications,
  MarkNotificationRead,
  MarkAllNotificationsRead,
  DeleteNotification,
} from "./Controller.js";

router.route("/").post(CreateNotification).get(GetMyNotifications);
router.patch("/read-all", MarkAllNotificationsRead);
router.patch("/:id/read", MarkNotificationRead);
router.delete("/:id", DeleteNotification);

export default router;
