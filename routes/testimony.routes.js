import express from "express";
const router = express.Router();

import TestimonyController from "../controllers/testimony.controller.js";
const tstmCtrl = new TestimonyController();

import uploader from "../middlewares/uploader.middleware.js";
const { uploadSingleImage } = uploader;

// /testimony
router
  .route("/")
  .post(uploadSingleImage, tstmCtrl.addNewTestimony)
  .get(tstmCtrl.getAllTestimonies);

router.route("/count").get(tstmCtrl.countTestimony);

// /testimony/:id
router
  .route("/:id")
  .patch(uploadSingleImage, tstmCtrl.updateTestimony)
  .get(tstmCtrl.getTestimonyById)
  .delete(tstmCtrl.deleteTestimony);

export default router;
