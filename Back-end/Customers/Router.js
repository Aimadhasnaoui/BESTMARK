import express from "express";
const router = express.Router();
import { CreateCustomerRequest, GetCustomerRequests, GetCustomerRequest, UpdateCustomerRequest, DeleteCustomerRequest } from "./Controller.js";

router.route("/").post(CreateCustomerRequest).get(GetCustomerRequests);
router.route("/:id").get(GetCustomerRequest).patch(UpdateCustomerRequest).delete(DeleteCustomerRequest);

export default router;
