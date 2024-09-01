import express from "express";
const router = express.Router();

import projectController from "../controllers/project.controller.js";
const prjCtrl = new projectController();

import isLoggedIn from "../middlewares/auth.middleware.js";

// Importing the default export and destructuring
import uploader from "../middlewares/uploader.middleware.js";
const { uploadArrayImages } = uploader;

router.use(isLoggedIn);

//  /project/
router
  .route("/")
  .post(uploadArrayImages, prjCtrl.insertProject)
  .get(prjCtrl.getAllProjects);

//  /project/:id
router
  .route("/:id")
  .get(prjCtrl.getSingleProject)
  .patch(uploadArrayImages, prjCtrl.updateProject)
  .delete(prjCtrl.deleteProject);

export default router;
