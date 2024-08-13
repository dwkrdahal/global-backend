import express from "express"
const router = express.Router();

import homeController from "../controllers/home.controller.js";
const homeCtrl = new homeController 

//  /
router.get('/', homeCtrl.home)

// /about
router.get("/about", homeCtrl.about)

// /contact
router.get("/contact", homeCtrl.contact)

export default router;