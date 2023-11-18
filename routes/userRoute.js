import express from "express";
import { create, deleteUser, fetch, updateUser } from "../controller/userController.js";

const route = express.Router();

route.get("/fetch", fetch);
route.post("/create", create);
route.put("/update/:id",updateUser)
route.delete("/delete/:id",deleteUser)


export default route;
