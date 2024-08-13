import express from "express";
const router = express.Router();

import UserPreferenceController from "../controllers/user-preference.controller.js";
const userPreferenceController = new UserPreferenceController();

import isLoggedIn from "../middlewares/auth.middleware.js";

router.use(isLoggedIn)

router
  .route("/")
  .patch( userPreferenceController.createOrUpdatePreference)
  .get( userPreferenceController.getorCreatePreference)


export default router;
