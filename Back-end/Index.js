import express from "express";
import dotenv from "dotenv";
import mongoose from "mongoose";
import { handeUnhanledRoute ,globalErrorHandler} from "./Midelwars/ErrorHandlers.js";

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

app.get("/", (req, res) => {
  res.send("Hello World!");
});

app.listen(process.env.PORT, () => {
  console.log(`Server is running on port ${process.env.PORT}`);
});
app.all(/.*/, handeUnhanledRoute);
app.use(globalErrorHandler);