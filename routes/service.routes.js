import express from "express";
const router = express.Router();

import serviceController from "../controllers/service.controller.js";
const serviceCtrl = new serviceController();

import uploader from "../middlewares/uploader.middleware.js";
const { uploadImages } = uploader;

// /service
router
  .route("/")
  .post(uploadImages([{ name: "image", maxCount: 1 }]), serviceCtrl.addService)
  .get(serviceCtrl.getAllServices);

router.route("/count").get(serviceCtrl.countService);

// /service/:id
router
  .route("/:id")
  .get(serviceCtrl.getServiceById)
  .delete(serviceCtrl.deleteServiceById)
  .patch(
    uploadImages([{ name: "image", maxCount: 1 }]),
    serviceCtrl.updateService
  );

export default router;
