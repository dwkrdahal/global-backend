import Banner from "../models/banner.model.js";

class BannerController {
  //add new banner
  addNewImageBanner = async (req, res, next) => {
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

      const banner = new Banner({
        ...newData,
        image,
      });

      const newBanner = await banner.save();
      res.status(201).json({
        result: newBanner,
        status: true,
        msg: "banner added",
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

  addNewVideoBanner = async (req, res, next) => {
    try {
      const newData = req.body;
      let video = {};

      if (req.file) {
        video = {
          url: req.file?.path,
          caption: req.file?.originalname,
        };
        // console.log(video);
      }

      const banner = new Banner({
        ...newData,
        video,
      });

      const newBanner = await banner.save();
      res.status(201).json({
        result: newBanner,
        status: true,
        msg: "banner added",
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({
        result: error,
        status: false,
        msg: error.message,
      });
    }
  };

  deleteBanner = async (req, res, next) => {
    try {
      const { id } = req.params;
      const result = await Banner.findByIdAndDelete(id);
      if (!result) {
        return res.status(404).json({
          result: null,
          status: false,
          msg: "Banner not found",
        });
      }

      res.status(200).json({
        result: result,
        msg: "banner deleted successfully",
        status: true,
      });
    } catch (error) {
      console.error(error);
      res
        .status(500)
        .json({
          result: error,
          status: false,
          msg: "Failed to delete banner",
        });
    }
  };

  updateImageBanner = async (req, res, next) => {
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

      const updatedBanner = await Banner.findByIdAndUpdate(
        id,
        { $set: updateData },
        { new: true }
      );

      if (!updatedBanner) {
        return res
          .status(404)
          .json({ result: null, status: false, msg: "banner not found" });
      }
      res.status(200).json({
        result: updatedBanner,
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
          msg: "Failed to update banner",
        });
    }
  };

  updateVideoBanner = async (req, res, next) => {
    try {
      const { id } = req.params;
      const updateData = req.body;

      if (req.file) {
        const updatedVideo = {
          url: req.file.path,
          caption: req.file.originalname,
        };
        updateData.video = updatedVideo;
      } else {
        // Remove `video` from updateData if it's being sent as an invalid string
        delete updateData.video;
      }

      const updatedBanner = await Banner.findByIdAndUpdate(
        id,
        { $set: updateData },
        { new: true }
      );

      if (!updatedBanner) {
        return res
          .status(404)
          .json({ result: null, status: false, msg: "banner not found" });
      }
      res.status(200).json({
        result: updatedBanner,
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
          msg: "Failed to update banner",
        });
    }
  };

  getBannerById = async (req, res, next) => {
    try {
      const { id } = req.params;
      const banner = await Banner.findById(id);
      if (!banner) {
        return res
          .status(404)
          .json({ result: null, status: false, msg: "banner not found" });
      }
      res.status(200).json({
        result: banner,
        msg: "fetch success",
        status: true,
      });
    } catch (error) {
      // console.error(error);
      res
        .status(500)
        .json({ result: error, status: false, msg: "Failed to get banner" });
    }
  };

  getAllBanners = async (req, res, next) => {
    try {
      const banners = await Banner.find();
      if (!banners) {
        return res
          .status(404)
          .json({ result: null, status: false, msg: "banners not found" });
      }
      res.status(200).json({
        result: banners,
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
          msg: "Failed to get banners",
        });
    }
  };
}

export default BannerController;
