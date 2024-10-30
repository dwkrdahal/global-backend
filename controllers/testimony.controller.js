import Testimony from "../models/testimony.model.js";

class TestimonyController {

   // Testimony count function
   countTestimony = async (req, res, next) => {
    try {
      const testimonyCount = await Testimony.countDocuments(); // Get total count of testimonies

      res.status(200).json({
        result: { count: testimonyCount },
        status: true,
        msg: "success! testimony count retrieved",
      });
    } catch (error) {
      console.error("Error counting testimonies:", error);

      next({
        result: error,
        status: false,
        msg: "server error! cannot retrieve testimony count",
      });
    }
  };

  //add new testimony
  addNewTestimony = async (req, res, next) => {
    try {
      const newData = req.body;
      let image = {};

      if (req.file) {
        image = {
          url: req.file?.path,
          caption: req.file?.originalname,
        };
        // console.log(image);
      }

      const testimony = new Testimony({
        ...newData,
        image,
      });

      const newTestimony = await testimony.save();
      res.status(201).json({
        result: newTestimony,
        status: true,
        msg: "testimony added",
      });
    } catch (error) {
      // console.error(error);
      res.status(500).json({
        result: error,
        status: false,
        msg: error.message,
      });
    }
  };

  deleteTestimony = async (req, res, next) => {
    try {
      const { id } = req.params;
      const result = await Testimony.findByIdAndDelete(id);
      if (!result) {
        return res.status(404).json({
          result: null,
          status: false,
          msg: "Testimony not found",
        });
      }

      res.status(200).json({
        result: result,
        msg: "testimony deleted successfully",
        status: true,
      });
    } catch (error) {
      console.error(error);
      res
        .status(500)
        .json({
          result: error,
          status: false,
          msg: "Failed to delete testimony",
        });
    }
  };

  updateTestimony = async (req, res, next) => {
    try {
      const { id } = req.params;
      const updateData = req.body;

      if (req.file) {
        const updatedImage = {
          url: req.file.path,
          caption: req.file.originalname,
        };
        updateData.image = updatedImage;
      } else {
        // Remove `image` from updateData if it's being sent as an invalid string
        delete updateData.image;
      }

      const updatedTestimony = await Testimony.findByIdAndUpdate(
        id,
        { $set: updateData },
        { new: true }
      );

      if (!updatedTestimony) {
        return res
          .status(404)
          .json({ result: null, status: false, msg: "testimony not found" });
      }
      res.status(200).json({
        result: updatedTestimony,
        status: true,
        msg: "update successful",
      });
    } catch (error) {
      // console.error(error);
      res
        .status(500)
        .json({
          result: error,
          status: false,
          msg: "Failed to update testimony",
        });
    }
  };

  getTestimonyById = async (req, res, next) => {
    try {
      const { id } = req.params;
      const testimony = await Testimony.findById(id);
      if (!testimony) {
        return res
          .status(404)
          .json({ result: null, status: false, msg: "testimony not found" });
      }
      res.status(200).json({
        result: testimony,
        msg: "fetch success",
        status: true,
      });
    } catch (error) {
      // console.error(error);
      res
        .status(500)
        .json({ result: error, status: false, msg: "Failed to get testimony" });
    }
  };

  getAllTestimonies = async (req, res, next) => {
    try {
      const testimonies = await Testimony.find();
      if (!testimonies) {
        return res
          .status(404)
          .json({ result: null, status: false, msg: "testimonies not found" });
      }
      res.status(200).json({
        result: testimonies,
        msg: "fetch success",
        status: true,
      });
    } catch (error) {
      // console.error(error);
      res
        .status(500)
        .json({
          result: error,
          status: false,
          msg: "Failed to get testimonies",
        });
    }
  };
}

export default TestimonyController;
