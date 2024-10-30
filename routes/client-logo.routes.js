import express from "express";
const router = express.Router();

import ClientlogoController from "../controllers/client-logo.controller.js";
const logoCtrl = new ClientlogoController();

import uploader from "../middlewares/uploader.middleware.js";
const { uploadSingleImage, uploadImages } = uploader;

// /logo
router
  .route("/")
  .post(uploadSingleImage, logoCtrl.insertLogo)
  .get(logoCtrl.getAllLogo);

router.route("/count").get(logoCtrl.countClient);

// /logo/:id
router
  .route("/:id")
  .patch(uploadSingleImage, logoCtrl.updateLogo)
  .get(logoCtrl.getLogoById)
  .delete(logoCtrl.deleteLogo);

export default router;
