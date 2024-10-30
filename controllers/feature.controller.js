import Feature from "../models/feature.model.js";

class featureController {
   // Feature count function
   countFeature = async (req, res, next) => {
    try {
      const serviceCount = await Feature.countDocuments(); // Get total count of services

      res.status(200).json({
        result: { count: serviceCount },
        status: true,
        msg: "success! service count retrieved",
      });
    } catch (error) {
      console.error("Error counting services:", error);

      next({
        result: error,
        status: false,
        msg: "server error! cannot retrieve service count",
      });
    }
  };
  
  // get all features
  getAllFeatures = async (req, res, next) => {
    try {
      const features = await Feature.find();

      if (!features || features.length < 1) {
        return res.status(404).json({
          result: null,
          status: false,
          msg: "no features found",
        });
      }

      res.status(200).json({
        result: features,
        status: true,
        msg: "features fetched success!",
      });
    } catch (error) {
      next({
        result: error,
        msg: error.message,
        status: false,
      });
    }
  };

  //add features
  addFeature = async (req, res, next) => {
    try {
      const data = req.body;

      const feature = new Feature(data);
      const newFeature = await feature.save();

      if (newFeature) {
        res.status(201).json({
          result: newFeature,
          status: true,
          msg: "new feature added",
        });
      }
    } catch (error) {
      next({
        result: error,
        status: false,
        msg: error.message,
      });
    }
  };

  //update feature
  updateFeatureById = async (req, res, next) => {
    try {
      const id = req.params.id;
      const body = req.body;

      // find the featire by id
      const feature = await Feature.findById(id);
      if (!feature) {
        return res.status(404).json({
          result: null,
          msg: "feature not found",
          status: false,
        });
      }

      //update feature
      const updatedFeature = await Feature.findByIdAndUpdate(id, body, {
        new: true,
        upsert: true,
      });

      if (!updatedFeature) {
        return res.status(404).json({
          result: null,
          status: false,
          msg: "feature not updated",
        });
      }

      // response with updated result
      res.status(200).json({
        result: updatedFeature,
        status: true,
        msg: "this feature is updated!",
      });
    } catch (error) {
      next({
        status: false,
        msg: error.message,
        result: error,
      });
    }
  };

  //get feature by id
  getFeatureById = async (req, res, next) => {
    try {
      const id = req.params.id;
      const body = req.body;

      const feature = await Feature.findById(id);
      if (!feature) {
        return res.status(404).json({
          result: null,
          msg: "not found",
          status: false,
        });
      }

      res.status(200).json({
        result: feature,
        msg: "feature fetched",
        status: true,
      });
    } catch (error) {
      next({
        status: false,
        msg: error.message,
        result: error,
      });
    }
  };

  //delete one feature
  deleteFeatureById = async (req, res, nwxt) => {
    try {
      const id = req.params.id;

      const result = await Feature.findByIdAndDelete(id);

      if (!result) {
        return res.status(404).json({
          result: null,
          status: false,
          msg: "cannot find data",
        });
      }

      res.status(200).json({
        result: result,
        status: true,
        msg: "feature deleted",
      });
    } catch (error) {
      next({
        result: error,
        msg: error.message,
        status: false,
      });
    }
  };
}

export default featureController;
