import express from "express";
import {
  create,
  deleteUser,
  fetch,
  loginUser,
  logoutUser,
  updateUser,
  updateloginUser,
} from "../controller/userController.js";
import { authMiddleware } from "../middleware/authmiddleware.js";

const route = express.Router();

route.get("/fetch", fetch);
route.post("/create", create);
route.put("/update/:id", updateUser);
route.delete("/delete/:id", deleteUser);

route.post("/login", loginUser);
route.get("/logout", logoutUser);
route.put("/loginupdate/:id", authMiddleware, updateloginUser);

export default route;
