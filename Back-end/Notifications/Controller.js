import Notification from "./Notification.js";
import { catchAsync } from "../utils/CatchFunction.js";
import APPError from "../utils/ErrorHandler.js";

// Helper for other controllers (deliveries, stock, ...) to push a notification.
// It never throws: a failed notification must not break the main action.
// Pass `session` when called inside a transaction so it rolls back with it.
export const createNotification = async (
  { emploisId, message, path, type },
  session = null,
) => {
  if (!emploisId || !message) return null;
  try {
    const [notification] = await Notification.create(
      [{ emploisId, message, path, type }],
      { session },
    );
    return notification;
  } catch (error) {
    console.error("Failed to create notification:", error.message);
    return null;
  }
};

export const CreateNotification = catchAsync(async (req, res, next) => {
  const { emploisId, message, path, type } = req.body;
  const notification = await Notification.create({
    emploisId,
    message,
    path,
    type,
  });
  res.status(201).json({ success: true, notification });
});

// Notifications of the logged-in employee only
export const GetMyNotifications = catchAsync(async (req, res, next) => {
  const filter = { emploisId: req.user._id };
  if (req.query.read === "true") filter.read = true;
  if (req.query.read === "false") filter.read = false;

  const notifications = await Notification.find(filter).sort({ createdAt: -1 });
  const unreadCount = await Notification.countDocuments({
    emploisId: req.user._id,
    read: false,
  });
  res.status(200).json({ success: true, unreadCount, notifications });
});

export const MarkNotificationRead = catchAsync(async (req, res, next) => {
  const notification = await Notification.findOneAndUpdate(
    { _id: req.params.id, emploisId: req.user._id },
    { read: true },
    { new: true },
  );
  if (!notification) {
    return next(
      new APPError(`Notification with ID ${req.params.id} not found`, 404),
    );
  }
  res.status(200).json({ success: true, notification });
});

export const MarkAllNotificationsRead = catchAsync(async (req, res, next) => {
  const result = await Notification.updateMany(
    { emploisId: req.user._id, read: false },
    { read: true },
  );
  res.status(200).json({ success: true, modified: result.modifiedCount });
});

export const DeleteNotification = catchAsync(async (req, res, next) => {
  const notification = await Notification.findOneAndDelete({
    _id: req.params.id,
    emploisId: req.user._id,
  });
  if (!notification) {
    return next(
      new APPError(`Notification with ID ${req.params.id} not found`, 404),
    );
  }
  res.status(200).json({ success: true, notification });
});
