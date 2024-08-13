import express from "express";
const router = express.Router();

import AuthController from "../controllers/auth.controller.js";
const authCtrl = new AuthController();

//  /auth/login
router.post("/login", authCtrl.login );

//  /auth/register
router.post("/register", authCtrl.register);

export default router;
