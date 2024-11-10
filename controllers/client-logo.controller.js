import ClientLogo from "../models/client-logo.model.js";
import uploadToCloudinary from "../utils/cloudinaryConfig.js";

class ClientlogoController {
  // Client count function
  countClient = async (req, res, next) => {
    try {
      const clientCount = await ClientLogo.countDocuments(); // Get total count of clients

      res.status(200).json({
        result: { count: clientCount },
        status: true,
        msg: "success! client count retrieved",
      });
    } catch (error) {
      console.error("Error counting clients:", error);

      next({
        result: error,
        status: false,
        msg: "server error! cannot retrieve client count",
      });
    }
  };

  //insertLogo
  insertLogo = async (req, res, next) => {
    try {
      const newData = req.body;
      let image = {};

      if (req.file) {
        // Upload image buffer to Cloudinary
        const uploadedImage = await uploadToCloudinary(req.file.buffer, "logo");

        // Store the Cloudinary secure URL
        image = {
          url: uploadedImage.secure_url, // Cloudinary URL
          caption: req.file.originalname, // Use original name as caption if needed
        };
      }

      const clientLogo = new ClientLogo({
        ...newData,
        image,
      });

      const newClientLogo = await clientLogo.save();
      res.status(201).json({
        result: newClientLogo,
        status: true,
        msg: "upload successful",
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

  deleteLogo = async (req, res, next) => {
    try {
      const { id } = req.params;
      const result = await ClientLogo.findByIdAndDelete(id);
      if (!result) {
        return res.status(404).json({
          result: null,
          status: false,
          msg: "Logo not found",
        });
      }

      // Optionally, delete the file from the filesystem
      if (result.logo) {
        fs.unlinkSync(result.logo.url);
      }
      res.status(200).json({
        result: result,
        msg: "Logo deleted successfully",
        status: true,
      });
    } catch (error) {
      // console.error(error);
      res
        .status(500)
        .json({ result: error, status: false, msg: "Failed to delete logo" });
    }
  };

  updateLogo = async (req, res, next) => {
    let image = {};
    try {
      const { id } = req.params;
      const updateData = req.body;

      if (req.file) {
        // Upload image buffer to Cloudinary
        const uploadedImage = await uploadToCloudinary(req.file.buffer, "logo");
        
        // Store the Cloudinary secure URL
        image = {
          url: uploadedImage?.secure_url, // Cloudinary URL
          caption: req.file?.originalname, // Use original name as caption if needed
        };

        updateData.image = image;
      } else {
        // Remove `image` from updateData if it's being sent as an invalid string
        delete updateData.image;
      }

      const updatedClientLogo = await ClientLogo.findByIdAndUpdate(
        id,
        { $set: updateData },
        { new: true }
      );

      if (!updatedClientLogo) {
        return res
          .status(404)
          .json({ result: null, status: false, msg: "Logo not found" });
      }
      res.status(200).json({
        result: updatedClientLogo,
        status: true,
        msg: "update successful",
      });
    } catch (error) {
      // console.error(error);
      res
        .status(500)
        .json({ result: error, status: false, msg: "Failed to update logo" });
    }
  };

  getLogoById = async (req, res, next) => {
    try {
      const { id } = req.params;
      const clientLogo = await ClientLogo.findById(id);
      if (!clientLogo) {
        return res
          .status(404)
          .json({ result: null, status: false, msg: "Logo not found" });
      }
      res.status(200).json({
        result: clientLogo,
        msg: "fetch success",
        status: true,
      });
    } catch (error) {
      // console.error(error);
      res
        .status(500)
        .json({ result: error, status: false, msg: "Failed to get logo" });
    }
  };

  getAllLogo = async (req, res, next) => {
    try {
      const clientLogo = await ClientLogo.find();
      if (!clientLogo) {
        return res
          .status(404)
          .json({ result: null, status: false, msg: "Logo not found" });
      }
      res.status(200).json({
        result: clientLogo,
        msg: "fetch success",
        status: true,
      });
    } catch (error) {
      // console.error(error);
      res
        .status(500)
        .json({ result: error, status: false, msg: "Failed to get logo" });
    }
  };
}

export default ClientlogoController;
