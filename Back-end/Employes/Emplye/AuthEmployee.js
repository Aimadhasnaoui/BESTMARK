import Employee from "./Employee.js";
import { catchAsync } from "../../utils/CatchFunction.js";
import APPError from "../../utils/ErrorHandler.js";
import jwt from "jsonwebtoken";
const CookiesParametr = {
  expires: new Date(Date.now() + process.env.CookieseXPIRE),
  httpOnly: true,
};
//login Controller
export const LoginEmplois = catchAsync(async (req, res, next) => {
  const { username, password } = req.body;
  if (!username || !password) {
    return next(
      new APPError(
        "S'il vous plaît, entrez votre nom et votre mot de passe.",
        400,
      ),
    );
  }
  const employee = await Employee.findOne({ name: username }).select(
    "+password +isActive",
  );
  if (!employee) {
    return next(
      new APPError("le nom d'employe ou le password  est incorrect ", 401),
    );
  }
  const isMatch = await employee.matchPassword(password);
  if (!isMatch) {
    return next(
      new APPError(" le nom d'employe ou le password est incorrect  ", 401),
    );
  }
  if (!employee.isActive) {
    return next(new APPError("Votre compte a été désactivé.", 401));
  }
  const paylouad = { id: employee._id };
  const token = jwt.sign(paylouad, process.env.SecureTokenKey, {
    expiresIn: process.env.tOKENeXPIRE,
  });
  if (process.env.envirement === production) CookiesParametr.secure = true;
  res.cookie("jwt", token, CookiesParametr);

  res.status(200).json({ message: "Connexion réussie pour l'utilisateur" });
});

// changer password controller
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
    message: "le mot de passe est changé avec succès",
  });
});

// desactiver account of employer
export const DesactiverAccount = catchAsync(async (req, res, next) => {
  const employer = await Employee.findById(req.params.id);

  if (!employer) {
    return next(new APPError("Aucun employé trouvé avec cet ID", 404));
  }
  employer.isActive = false;
  employer.AccountDesactivateDate = new Date();
  await employer.save();

  res.status(200).json({
    message: "L'account a été désactivé avec succès",
  });
});

//get user loged Info
export const me = catchAsync(async (req, res, next) => {
  const userInfo = req.user;
  res.status(200).json({
    userInfo,
  });
});

// verify token midelware
export const Protect = catchAsync(async (req, res, next) => {
  let token;
  if (!req?.headers?.authorization || !req.headers) {
    console.log("accès refusé");
    return next(new APPError("accès refusé", 401));
  }
  token = req.headers.authorization.split(" ")[1];
  const decodedToken = jwt.verify(token, process.env.SecureTokenKey);
  const userexist = await Employee.findById(decodedToken.id).select(
    "+isActive",
  );
  if (!userexist || !userexist.isActive) {
    return next(
      new APPError("l'accès de l'utilisateur a été  desactiver", 401),
    );
  }
  const TokenValide = await userexist.isPaswordchnageAfterToekn(
    decodedToken.iat,
  );
  if (TokenValide) {
    return next(new APPError("ce accès  été  desactiver", 401));
  }
  req.user = userexist;
  next();
});
