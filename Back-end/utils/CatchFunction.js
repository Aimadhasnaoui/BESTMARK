import mongoose from "mongoose";

export const catchAsync = (fn) => {
  return (req, res, next) => {
    fn(req, res, next).catch(next);
  };
};

/**
 * Wraps an async function in a database transaction.
 * Automatically starts/ends the session and commits/aborts the transaction.
 * Passes the session as the 4th argument to the controller.
 */
export const transactional = (fn) =>
  catchAsync(async (req, res, next) => {
    const session = await mongoose.startSession();
    try {
      await session.withTransaction(async () => {
        await fn(req, res, next, session);
      });
    } finally {
      session.endSession();
    }
  });