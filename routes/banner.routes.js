import express from "express";
const router = express.Router();

import BannerController from "../controllers/banner.controller.js";
const bannerCtrl = new BannerController();

import uploader from "../middlewares/uploader.middleware.js";
const { uploadSingleImage, uploadSingleVideo } = uploader;

// /banner
router
  .route("/")
  .get(bannerCtrl.getAllBanners);

// /banner/image
router.route("/image").post(uploadSingleImage, bannerCtrl.addNewImageBanner);

// /banner/video
router.route("/video").post(uploadSingleVideo, bannerCtrl.addNewVideoBanner);

// /banner/image/:id
router.route("/image/:id").patch(uploadSingleImage, bannerCtrl.updateImageBanner)

// /banner/image/:id
router.route("/video/:id").patch(uploadSingleVideo, bannerCtrl.updateVideoBanner)

// /banner/:id
router
  .route("/:id")
  .get(bannerCtrl.getBannerById)
  .delete(bannerCtrl.deleteBanner);

export default router;
