import Service from "../models/service.model.js";

class serviceController {
  addService = async (req, res, next) => {
    try {
      const data = req.body;
      const image = {};

      if (req.files?.images && req.files?.image?.length > 0) {
        const imageFile = req.files.image[0];
        image.url = imageFile.path;
        image.caption = imageFile.originalname;
      }

      const newService = new Service({
        ...data,
        image,
      });
      const addedService = await newService.save();

      res.status(201).json({
        result: addedService,
        status: true,
        msg: "service added",
      });
    } catch (error) {
      // console.log(error);
      next({
        result: error,
        status: false,
        msg: "server error",
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

      //find service by ID
      const service = await Service.findById(serviceId);
      if(!service){
        return res.status(404).json({
          result: null,
          status: false,
          msg: "service not found"
        })
      }

      let {image} = service;
      
      if (req.files?.image && req.files.image?.length > 0) {
        const imageFile = req.files.image[0];
        image.url = imageFile.path;
        image.caption = imageFile.originalname;
      }

      const updatedService = await Service.findByIdAndUpdate(serviceId,
        {...data, image},
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
