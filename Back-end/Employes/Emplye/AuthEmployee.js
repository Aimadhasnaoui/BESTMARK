import Employee from "./Employee.js";
import { catchAsync } from "../../utils/CatchFunction.js";
import APPError from "../../utils/ErrorHandler.js";
import jwt from "jsonwebtoken";

export const LoginEmplois = catchAsync(async (req, res, next) => {
  const { username, password } = req.body;
  if (!username || !password) {
    return next(new APPError("Please enter your name and password", 400));
  }
  const employee = await Employee.findOne({ name: username }).select(
    "+password +isActive");
  if (!employee) {
    return next(new APPError("le nom d'employe   est incorrect ", 401));
  }
  const isMatch = await employee.matchPassword(password);
  if (!isMatch) {
    return next(new APPError(" le password  est incorrect  ", 401));
  }
  if (!employee.isActive) {
    return next(new APPError("votre compte n'est pas activer  ", 401));
  }
  const paylouad = { id: employee._id };
  const token = jwt.sign(paylouad, process.env.SecureTokenKey, {
    expiresIn: process.env.tOKENeXPIRE,
  });

  res.status(200).json({ success: true, employee, token });
});

export const ChnageUserPaword = catchAsync(async (req, res, next) => {
  const { password } = req.body;
  // 1. Find the user first
  const employer = await Employee.findById(req.params.id);

  if (!employer) {
    return next(new APPError("Aucun employé trouvé avec cet ID", 404));
  }

  // 2. Update the fields manually
  employer.password = password;
  employer.passwordchangeafter = Date.now();

  // 3. Use .save() so that your pre('save') middleware runs!
  await employer.save();
  res.status(200).json({
    message: "le mot de passe est chnager avec succes",
  });
});

export const Protect = catchAsync(async (req, res, next) => {
  let token;
  if (!req?.headers?.authorization || !req.headers) {
    console.log("accès refusé");
    return next(new APPError("accès refusé", 401));
  }
  token = req.headers.authorization.split(" ")[1];
  const decodedToken = jwt.verify(token, process.env.SecureTokenKey);
  const userexist = await Employee.findById(decodedToken.id).select(
    "+isActive"
  );;
  if (!userexist || !userexist.isActive) {
    return next(
      new APPError("l'accès de l'utilisateur a été  desactiver", 401),
    );
  }
  const TokenValide = await userexist.isPaswordchnageAfterToekn(
    decodedToken.iat,
  );
  console.log(TokenValide);
  if (TokenValide) {
    return next(new APPError("ce accès  été  desactiver", 401));
  }
  req.user = userexist
  console.log(req)
  next();
});
