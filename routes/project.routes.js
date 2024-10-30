import express from "express";
const router = express.Router();

import projectController from "../controllers/project.controller.js";
const prjCtrl = new projectController();

import isLoggedIn from "../middlewares/auth.middleware.js";

// Importing the default export and destructuring
import uploader from "../middlewares/uploader.middleware.js";
const { uploadArrayImages } = uploader;

//  /project/
router
  .route("/")
  .post(isLoggedIn, uploadArrayImages, prjCtrl.insertProject)
  .get(prjCtrl.getAllProjects);

router.route("/style").get(prjCtrl.getAllStyles);
router.route("/featured").get(prjCtrl.getAllFeaturedProjects);
router.route("/count").get(prjCtrl.countProject);

//  /project/:id
router
  .route("/:id")
  .get(prjCtrl.getSingleProject)
  .patch(isLoggedIn, uploadArrayImages, prjCtrl.updateProject)
  .delete(isLoggedIn, prjCtrl.deleteProject);

router.route("/:id/updateMainImage").put(prjCtrl.updateMainImage);

export default router;
