import express from "express";
import * as authController from "../controller/auth.js";

const router = express.Router();

router.post("/auth/register", authController.register);

router.post("/auth/login", authController.login);

export default router;
