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
      res.status(statusCode).json({
        status: "error",
        message,
      });
    } else {
      console.error("Error =>", err.name);
      console.error("Error =>", err);
      // if(err.heartbeatFrequencyMS === 10000){ // }
      //   if (err.name === 'CastError') err = handleCastErrorDB(err);
      //   if (err.code === 11000) err = handleDuplicateFieldsDB(err);

        if (err.name === 'JsonWebTokenError' || err.name === "TokenExpiredError"){          
          return   res.status(401).json({
              sttus:'error',
              message:'accès refusé'
             });
        }
        if (err.name === 'ValidationError'){
          const errors = Object.values(err.errors).map(error => error.message);
            res.status(400).send(errors);
       
        }
      res.status(500).json({
        status: "error",
        message: "Internal Server Error",
      });
    }
  }
};
