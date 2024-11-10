import express from "express";
const router = express.Router();

import messageController from "../controllers/message.controller.js";
const msgCtrl = new messageController();

import isLoggedIn from "../middlewares/auth.middleware.js";

// Importing the uploader middleware
import uploader from "../middlewares/uploader.middleware.js";
const { uploadSingleImage, uploadArrayImages, uploadArrayVideos, handleFileUpload } = uploader;

// Routes for messages
// /message
router
  .route("/")
  .post(handleFileUpload, msgCtrl.createMessage) // Using the file upload middleware here
  .get(isLoggedIn, msgCtrl.getAllMessages);

router.route("/count").get(msgCtrl.countMessage);

// /message/:id
router
  .route("/:id")
  .get(isLoggedIn, msgCtrl.getMessageById)
  .patch(isLoggedIn, uploadArrayImages(5), msgCtrl.respondToMessage)  
  .delete(isLoggedIn, msgCtrl.deleteMessage);

export default router;
