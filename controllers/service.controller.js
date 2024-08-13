import Service from "../models/service.model.js";

class serviceController {
  addService = async (req, res, next) => {
    try {
      const data = req.body;
      const icon = {};
      const image = {};

      console.log("files", req.files);

      if (req.files.icon && req.files.icon?.length > 0) {
        const iconFile = req.files.icon[0];
        icon.url = iconFile.path;
        icon.caption = iconFile.originalname;
      }

      if (req.files.icon && req.files.image?.length > 0) {
        const imageFile = req.files.image[0];
        image.url = imageFile.path;
        image.caption = imageFile.originalname;
      }

      const newService = new Service({
        ...data,
        icon,
        image,
      });
      const addedService = await newService.save();

      res.status(201).json({
        result: addedService,
        status: true,
        msg: "service added",
      });
    } catch (error) {
      console.log(error);

      next({
        result: error,
        status: false,
        msg: "error adding service",
      });
    }
  };

  getAllServices = async (req, res, next) => {
    try {
      const services = await Service.find({});

      if (!services) {
        return res.status(404).josn({
          result: null,
          status: false,
          msg: "service not found",
        });
      }

      res.status(200).json({
        result: services,
        status: true,
        msg: "services fetched",
      });
    } catch (error) {
      next({
        result: error,
        status: false,
        msg: "error fetching url",
      });
    }
  };

  getServiceById = async (req, res, next) => {
    try {
      const serviceId = req.params.id;
      const service = await Service.findById(serviceId);

      if (!service) {
        return res.status(404).json({
          result: null,
          status: false,
          msg: "service not found",
        });
      }

      res.status(200).json({
        result: service,
        status: true,
        msg: "service fetched",
      });
    } catch (error) {
      next({
        result: error,
        status: false,
        msg: "error fetching service",
      });
    }
  };

  deleteServiceById = async (req, res, next) => {
    try {
      const serviceId = req.params.id;

      const service = await Service.findByIdAndDelete(serviceId);

      if (!service) {
        return res.status(404).json({
          result: null,
          status: false,
          msg: "service not found",
        });
      }

      res.status(200).json({
        result: service,
        status: true,
        msg: "service deleted",
      });
    } catch (error) {
      next({
        result: error,
        status: false,
        msg: "error deleting the service",
      });
    }
  };

  updateService = async (req, res, next) => {
    try {
      const serviceId = req.params.id;
      const data = req.body;

      const service = await Service.findById(serviceId);
      if(!service){
        return res.status(404).json({
          result: null,
          status: false,
          msg: "service not found"
        })
      }

      let {icon, image} = service;

      console.log(req.files.icon);
      console.log(req.files.image);
      

      if (req.files?.icon && req.files.icon?.length > 0) {
        const iconFile = req.files.icon[0];
        icon.url = iconFile.path;
        icon.caption = iconFile.originalname;
      }

      if (req.files?.image && req.files.image?.length > 0) {
        const imageFile = req.files.image[0];
        image.url = imageFile.path;
        image.caption = imageFile.originalname;
      }

      const updatedService = await Service.findByIdAndUpdate(serviceId,
        {...data, icon, image},
        {new: true}
      )

      if(!updatedService){
        return res.status(404).json({
          result: null,
          status: false,
          msg: "service not found"
        })
      }

      res.status(200).json({
        result: updatedService,
        status: true,
        msg: "service updated"
      })

    } catch (error) {
      console.log(error);
      
      next({
        result: error,
        status: false,
        msg: "error updating status"
      })
    }
  };
}

export default serviceController;
