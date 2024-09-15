import Project from "../models/project.model.js";

class projectController {
  //insertion logic
  insertProject = async (req, res, next) => {
    try {
      const data = req.body;
      let images = [];

      if (req.files) {
        images = req.files.map((file) => ({
          url: file.path,
          caption: file.originalname,
        }));
      } else if (req.file) {
        images.push({
          url: req.file.path,
          caption: req.file.originalname,
        });
      }

      const newProject = new Project({
        ...data,
        images,
        createdBy: req.user._id,
      });

      const savedProject = await newProject.save();

      res.status(201).json({
        result: savedProject,
        status: true,
        msg: "success! project created",
      });
    } catch (error) {
      // console.error(error);
      next({
        result: error,
        status: 400,
        msg: "server error! cannot create project",
      });
    }
  };

  // fetch all projects
  getAllProjects = async (req, res, next) => {
    try {
      const projects = await Project.find();
      res.status(200).json({
        result: projects,
        status: true,
        msg: "projects retrieved successfully",
      });
    } catch (error) {
      next({
        result: error,
        status: false,
        msg: "server error! cannot fetch projects",
      });
    }
  };

  // fetch project by ID
  getSingleProject = async (req, res, next) => {
    try {
      const projectId = req.params.id;
      const project = await Project.findOne({ _id: projectId });
      if (!project) {
        res.status(404).json({
          result: null,
          status: false,
          msg: "project not found",
        });
      } else {
        res.status(200).json({
          result: project,
          status: true,
          msg: "project retrived",
        });
      }
    } catch (error) {
      console.log(error);
      next({
        result: error,
        status: false,
        msg: "error fetching the project",
      });
    }
  };

  // Update Project - Images Handling
  // Update project with image addition and deletion
  updateProject = async (req, res, next) => {
    try {
      const data = req.body;
      const projectId = req.params.id;

      const project = await Project.findById(projectId);

      if (!project) {
        return res.status(404).json({
          result: null,
          status: false,
          msg: "Project not found",
        });
      }

      let { images } = project;
      let newImages = [];

      // Ensure `images` is an array
      if (!Array.isArray(images)) {
        images = images ? [images] : [];
      }

      // Handle new image uploads
      if (req.files && req.files.length > 0) {
        newImages = req.files.map((file) => ({
          url: file.path,
          caption: file.originalname,
        }));
      }

      // Merge old and new images
      images = [...images, ...newImages];

      // Handle image deletions
      if (data.deletedImages) {
        const deletedImages = JSON.parse(data.deletedImages);
        images = images.filter((image) => !deletedImages.includes(image.url));
      }

      // Update the project with the new image array
      const updatedProject = await Project.findByIdAndUpdate(
        projectId,
        { ...data, images },
        { new: true }
      );

      if (updatedProject) {
        return res.status(200).json({
          result: updatedProject,
          status: true,
          msg: "Project updated",
        });
      } else {
        return res.status(400).json({
          result: null,
          status: false,
          msg: "Error! Cannot update project",
        });
      }
    } catch (error) {
      console.log(error);
      next({
        result: error,
        status: false,
        msg: "Error while updating project",
      });
    }
  };

  //delete project
  deleteProject = async (req, res, next) => {
    try {
      const projectId = req.params.id;
      const project = await Project.findByIdAndDelete({ _id: projectId });

      if (!project) {
        return res.status(404).json({
          result: null,
          status: false,
          msg: "project not found",
        });
      }

      res.status(200).json({
        result: project,
        status: false,
        msg: "project deleted",
      });
    } catch (error) {
      next({
        result: error,
        status: false,
        msg: "error deleting project",
      });
    }
  };
}

export default projectController;
