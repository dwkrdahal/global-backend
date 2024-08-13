import express from "express";
const router = express.Router();

//controller
import userController from "../controllers/user.controller.js";
const userCtrl = new userController();

// isloggedin middleware from auth
import isLoggedIn from "../middlewares/auth.middleware.js";

//checking middleware at first for all routes
router.use(isLoggedIn)

// /user
router.route("/")
  .get( userCtrl.getAllUsers);

// /user/bulk
router.route("/bulk")
    .patch(userCtrl.bulkUpdate)
    .delete(userCtrl.bulkDelete);

//updateprofile
// /user/update/profile
router.route("/update/profile") 
    .patch(userCtrl.updateProfile);

    // /user/delete/all
router.route("/delete/all")
    .delete(userCtrl.deleteAllUsers)

// /user/:id
router
  .route("/:id")
  .get(userCtrl.getUserById)
  .patch(userCtrl.updateUserById)
  .delete(userCtrl.deleteUserById);

export default router;
