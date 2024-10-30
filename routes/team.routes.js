import express from "express";
const router = express.Router();

import teamController from "../controllers/team.controller.js";
const teamCtrl = new teamController();

import uploader from "../middlewares/uploader.middleware.js";
const { uploadImages } = uploader;

// /team
router
  .route("/")
  .post(
    uploadImages([
      { name: "avatar", maxCount: 1 },
      { name: "cover", maxCount: 1 },
    ]),
    teamCtrl.addTeam
  )
  .get(teamCtrl.getAllTeams);

  router.route("/count").get(teamCtrl.countTeam);


// /team/:id
router
  .route("/:id")
  .patch(
    uploadImages([
      { name: "avatar", maxCount: 1 },
      { name: "cover", maxCount: 1 },
    ]),
    teamCtrl.updateTeamById
  )
  .get(teamCtrl.getTeamById)
  .delete(teamCtrl.deleteTeam);

export default router;
