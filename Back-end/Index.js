import express from "express";
import dotenv from "dotenv";
import mongoose from "mongoose";
import cors from "cors";
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
import Product from "./Products/Product/Router.js";
import Category from "./Products/Productcategories/Router.js";
import Expense from "./expenses/expense/Router.js";
import ExpenseType from "./expenses/ExpensesType/Router.js";
import { LoginEmplois, Protect } from "./Employes/Emplye/AuthEmployee.js";
import rateLimit from "express-rate-limit";
import helmet from "helmet";
import hpp from "hpp";
import cookieParser from "cookie-parser";
const app = express();
dotenv.config();
app.use(helmet());
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
    origin: "http://localhost:5174",
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
// const limiter = rateLimit({
//   max: 100,
//   windowMs: 60 * 60 * 1000, // 1 heure
//   message:
//     "Trop de requêtes venant de cette adresse IP, veuillez réessayer plus tard.",
// });
// app.use("/api", limiter);
app.disable("x-powered-by");
// Fin de la configuration des middlewares de sécurité

// Définition des routes de l'API
app.use("/api/users", Protect, User);
app.use("/api/transactions", Protect, Transaction);
app.use("/api/stock-movements", Protect, StockMovement);
app.use("/api/customers", Protect, Customer);
app.use("/api/delivery", Protect, Delivery);
app.use("/api/purchases", Protect, Purchase);
app.use("/api/suppliers", Protect, Supplier);
app.use("/api/sales", Protect, Sale);
app.use("/api/employees", Protect, Employee);
app.use("/api/employee-types", Protect, EmployeeType);
app.use("/api/products", Protect, Product);
app.use("/api/categories/products", Protect, Category);
app.use("/api/expenses", Protect, Expense);
app.use("/api/expense-types", Protect, ExpenseType);
app.post("/api/auth/login", LoginEmplois);
// Fin des routes de l'API

// Gestion globale des erreurs de l'application
app.all(/.*/, handeUnhanledRoute);
app.use(globalErrorHandler);
// Fin de la gestion des erreurs

app.listen(process.env.PORT, () => {
  console.log(`Server is running on port ${process.env.PORT}`);
});
