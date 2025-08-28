import { Router } from "express";
import { getUserData, login, signup } from "../controllers/auth.controller";
import { authMiddleware } from "../middlewares/auth.middleware";

const AuthHandler: Router = Router();

AuthHandler.post("/signup", signup);
AuthHandler.post("/login", login);
AuthHandler.get("/", authMiddleware, getUserData);

export default AuthHandler;
