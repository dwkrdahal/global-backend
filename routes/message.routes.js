import express from "express";
const router = express.Router();

import messageController from "../controllers/message.controller.js";
const msgCtrl = new messageController();

import isLoggedIn from "../middlewares/auth.middleware.js";

// Importing the default export and destructuring
import uploader from "../middlewares/uploader.middleware.js";
const { fileUpload } = uploader;

// Routes for messages
// /message
router.route("/")
  .post( fileUpload.array("files"), msgCtrl.createMessage)
  .get(isLoggedIn, msgCtrl.getAllMessages);

  // /message/:id
router.route("/:id")
  .get(isLoggedIn, msgCtrl.getMessageById)
  .patch(isLoggedIn, fileUpload.array("files"), msgCtrl.respondToMessage)
  .delete(isLoggedIn, msgCtrl.deleteMessage);

export default router;