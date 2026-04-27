import express from "express";
import dotenv from "dotenv";
import mongoose from "mongoose";
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

const app = express();
dotenv.config();
mongoose
  .connect(`${process.env.DataBase}`)
  .then(() => {
    console.log("Database connected successfully");
  })
  .catch((error) => {
    console.log("Database connection failed", error);
  });
app.use(express.json());
app.disable("x-powered-by");

app.use("/api/users", User);
app.use("/api/transactions", Transaction);
app.use("/api/stock-movements", StockMovement);
app.use("/api/customers", Customer);
app.use("/api/delivery", Delivery);
app.use("/api/purchases", Purchase);
app.use("/api/suppliers", Supplier);
app.use("/api/sales", Sale);
app.use("/api/employees", Employee);
app.use("/api/employee-types", EmployeeType);
app.use("/api/products", Product);
app.use("/api/categories", Category);
app.use("/api/expenses", Expense);
app.use("/api/expense-types", ExpenseType);

app.all(/.*/, handeUnhanledRoute);
app.use(globalErrorHandler);
app.listen(process.env.PORT, () => {
  console.log(`Server is running on port ${process.env.PORT}`);
});
