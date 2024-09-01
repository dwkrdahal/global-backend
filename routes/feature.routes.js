import express from "express";
const router = express.Router();

import FeatureController from "../controllers/feature.controller.js";
const featureCtrl = new FeatureController();

router.get("/", featureCtrl.getAllFeatures);
router.post("/", featureCtrl.addFeature);
router.patch("/edit/:id", featureCtrl.updateFeatureById);
router.delete("/delete/:id", featureCtrl.deleteFeatureById)
router.get("/:id", featureCtrl.getFeatureById);

export default router;