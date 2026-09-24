import APPError from "../utils/ErrorHandler.js";
export const handeUnhanledRoute = (req, res, next) => {
next(new APPError(`Can't find ${req.originalUrl}`,404))
};

// Conversion des erreurs connues (JWT, Mongoose, Multer) en APPError opérationnelles
const handleJWTError = () => new APPError("accès refusé", 401);

const handleCastErrorDB = (err) =>
  new APPError(`Valeur invalide pour le champ ${err.path} : ${err.value}`, 400);

const handleDuplicateFieldsDB = (err) => {
  const fields = Object.keys(err.keyValue || {}).join(", ");
  return new APPError(`Valeur déjà utilisée pour le champ : ${fields}`, 400);
};

const handleValidationErrorDB = (err) => {
  const errors = Object.values(err.errors).map((error) => error.message);
  return new APPError(errors.join(". "), 400);
};

const handleMulterError = (err) =>
  new APPError(
    err.code === "LIMIT_FILE_SIZE"
      ? "L'image dépasse la taille maximale autorisée (5MB)"
      : err.message,
    400,
  );

const normalizeError = (err) => {
  if (err.name === "JsonWebTokenError" || err.name === "TokenExpiredError")
    return handleJWTError();
  if (err.name === "CastError") return handleCastErrorDB(err);
  if (err.code === 11000) return handleDuplicateFieldsDB(err);
  if (err.name === "ValidationError") return handleValidationErrorDB(err);
  if (err.name === "MulterError") return handleMulterError(err);
  return err;
};

export const globalErrorHandler = (err, req, res, next) => {
  if (res.headersSent) return next(err);

  const error = normalizeError(err);
  const statusCode = error.statusCode || 500;
  const message = error.message || "Internal Server Error";
  const Enviroment = process.env.envirement;

  if (Enviroment === "development") {
    return res.status(statusCode).json({
      status: error.status || "error",
      code: statusCode,
      message,
      stack: err.stack || "",
    });
  }

  if (error.isOperational) {
    return res.status(statusCode).json({
      status: error.status,
      message,
    });
  }

  return res.status(500).json({
    status: "error",
    message: "Internal Server Error",
  });
};
