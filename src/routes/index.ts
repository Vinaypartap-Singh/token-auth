import { Router } from "express";
import AuthHandler from "../services/auth.service";

const RouteHandler: Router = Router();

RouteHandler.use("/api/v1/auth", AuthHandler);

export default RouteHandler;
