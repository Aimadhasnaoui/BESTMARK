import APPError from "../utils/ErrorHandler.js";
export const handeUnhanledRoute = (req, res, next) => {
next(new APPError(`Can't find ${req.originalUrl}`,404))
};

export const globalErrorHandler = (err, req, res, next) => {
  const statusCode = err.statusCode || 500;
  const message = err.message || "Internal Server Error";
  const stack = err.stack || "";
  const Enviroment = process.env.envirement;
  if (Enviroment === "devlopment") {
    res.status(statusCode).json({
      status:err.status,
      code:err.statusCode,
      message,
      stack,
    });
  } else {
    if (err.isOperational) {
        // if (err.name === 'CastError') err = handleCastErrorDB(err);
        // if (err.code === 11000) err = handleDuplicateFieldsDB(err);
        // if (err.name === 'ValidationError') err = handleValidationErrorDB(err);
      res.status(statusCode).json({
        status: "error",
        message,
      });
    } else {
      res.status(statusCode).json({
        status: "error",
        message: "Internal Server Error",
      });
    }
  }
};
