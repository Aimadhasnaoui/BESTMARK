import express from "express";
import dotenv from "dotenv";
import mongoose from "mongoose";
import cors from "cors";
import path from "path";
import { fileURLToPath } from "url";
import {
  handeUnhanledRoute,
  globalErrorHandler,
} from "./Midelwars/ErrorHandlers.js";
import User from "./Users/Router.js";
import Transaction from "./Transactions/Router.js";
import StockMovement from "./stockMovements/Router.js";
import Customer from "./Customers/Router.js";
import Delivery from "./Delivery/Router.js";
import Purchase from "./Purchases/Router.js";
import Supplier from "./Supplieres/Router.js";
import Sale from "./sales/Router.js";
import Employee from "./Employes/Emplye/Router.js";
import EmployeeType from "./Employes/typeemplois/Router.js";
import Payslip from "./Employes/FactureEmployer/Router.js";
import Dashboard from "./Dashboard/Router.js";
import Product from "./Products/Product/Router.js";
import Category from "./Products/Productcategories/Router.js";
import PermissionModel from "./PermissionModels/Router.js";
import Notification from "./Notifications/Router.js";
import { LoginEmplois, Protect } from "./Employes/Emplye/AuthEmployee.js";
import { RequirePermission } from "./Midelwars/RequirePermission.js";
import rateLimit from "express-rate-limit";
import helmet from "helmet";
import hpp from "hpp";
import cookieParser from "cookie-parser";
const __dirname = path.dirname(fileURLToPath(import.meta.url));
const app = express();
dotenv.config();
app.use(helmet());
app.use(
  "/uploads",
  (req, res, next) => {
    res.setHeader("Cross-Origin-Resource-Policy", "cross-origin");
    next();
  },
  express.static(path.join(__dirname, "uploads")),
);
mongoose
  .connect(`${process.env.DataBase}`)
  .then(() => {
    console.log("Database connected successfully");
  })
  .catch((error) => {
    console.log("Database connection failed", error);
  });

// Configuration des middlewares de sécurité et de protection

app.use(
  cors({
    origin: process.env.CLIENT_URL || "http://localhost:5173",
    credentials: true,
  }),
);
app.use(
  express.json({
    limit: "10kb",
  }),
);
app.use(cookieParser());

// Nettoyage in-place sécurisé pour bloquer les injections NoSQL ($) sans réassignation
const sanitizeObject = (obj) => {
  if (obj && typeof obj === "object") {
    Object.keys(obj).forEach((key) => {
      if (key.startsWith("$")) {
        delete obj[key];
      } else {
        sanitizeObject(obj[key]);
      }
    });
  }
};
const mongoSanitizeSafe = (req, res, next) => {
  sanitizeObject(req.body);
  sanitizeObject(req.query);
  sanitizeObject(req.params);
  next();
};
app.use(mongoSanitizeSafe);

app.use(hpp());
const limiter = rateLimit({
  max: 1000,
  windowMs: 15 * 60 * 1000, // 15 minutes
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    status: "fail",
    message:
      "Trop de requêtes venant de cette adresse IP, veuillez réessayer plus tard.",
  },
});
app.use("/api", limiter);

// Limiteur plus strict sur la connexion (anti-bruteforce) : seules les tentatives échouées comptent
const loginLimiter = rateLimit({
  max: 10,
  windowMs: 15 * 60 * 1000, // 15 minutes
  skipSuccessfulRequests: true,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    status: "fail",
    message:
      "Trop de tentatives de connexion, veuillez réessayer dans 15 minutes.",
  },
});
app.disable("x-powered-by");
// Fin de la configuration des middlewares de sécurité

// Définition des routes de l'API
// "/api/users" is legacy/unused by the front-end - authenticated only, no model permission gate.
app.use("/api/users", Protect, User);
app.use("/api/transactions", Protect, RequirePermission(["Finance", "Finance Rapport"]), Transaction);
app.use("/api/stock-movements", Protect, RequirePermission("Gestion de Stock"), StockMovement);
app.use("/api/customers", Protect, RequirePermission("Demandes clients"), Customer);
// "Livraisons" = full manager access; "Gestion des Livraisons" = livreur's own deliveries only
app.use("/api/delivery", Protect, RequirePermission(["Livraisons", "Gestion des Livraisons"]), Delivery);
app.use("/api/purchases", Protect, RequirePermission("Achats"), Purchase);
app.use("/api/suppliers", Protect, RequirePermission("Fournisseurs"), Supplier);
app.use("/api/sales", Protect, RequirePermission("Ventes"), Sale);
// Employee router applies RequirePermission("Employés") per-route internally,
// so /me and /me/permissions stay accessible to any authenticated employee.
app.use("/api/employees", Protect, Employee);
app.use("/api/employee-types", Protect, RequirePermission("Types d'employés"), EmployeeType);
app.use("/api/payslips", Protect, RequirePermission("Employés"), Payslip);
app.use("/api/dashboard", Protect, RequirePermission("Tableau de bord"), Dashboard);
app.use("/api/products", Protect, RequirePermission("Produits"), Product);
app.use("/api/categories/products", Protect, RequirePermission("Types de produits"), Category);
app.use("/api/permission-models", Protect, RequirePermission("Modèles & Permissions"), PermissionModel);
// Notifications are scoped to the logged-in employee, so no model permission gate.
app.use("/api/notifications", Protect, Notification);
app.post("/api/auth/login", loginLimiter, LoginEmplois);
// Fin des routes de l'API

// Gestion globale des erreurs de l'application
app.all(/.*/, handeUnhanledRoute);
app.use(globalErrorHandler);

// Fin de la gestion des erreurs
app.listen(process.env.PORT, () => {
  console.log(`Server is running on port ${process.env.PORT}`);
});
