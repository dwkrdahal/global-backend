import Project from "../models/project.model.js";

class projectController {
  //insertion logic
  insertProject = async (req, res, next) => {
    try {
      const data = req.body;
      let images = [];
      let mainImage = null;

      if (req.files && req.files.length > 0) {
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

      // Assign the first image as mainImage if available
      mainImage = images.length > 0 ? images[0] : null;

      const newProject = new Project({
        ...data,
        images,
        mainImage,
        createdBy: req.user._id,
      });

      const savedProject = await newProject.save();

      res.status(201).json({
        result: savedProject,
        status: true,
        msg: "success! project created",
      });
    } catch (error) {
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

      let { images, mainImage } = project;
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

        // If the main image is deleted, reassign it
        if (deletedImages.includes(mainImage?.url)) {
          // Choose a new main image from remaining images
          const newMainImage = images.length > 0 ? images[0] : null;
          mainImage = newMainImage;
        }
      }

      // Update the project with the new image array and mainImage
      const updatedProject = await Project.findByIdAndUpdate(
        projectId,
        {
          ...data,
          images,
          mainImage,
        },
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

  getAllStyles = async (req, res, next) => {
    try {
      // Fetch all projects from the database
      const projects = await Project.find({}, "projectType");

      // Extract and collect all unique styles
      const uniqueStyles = [
        ...new Set(projects.map((project) => project.projectType)),
      ];

      // Return the array of unique styles
      res.status(200).json({ styles: uniqueStyles });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Failed to fetch project styles" });
    }
  };

  getAllFeaturedProjects = async (req, res, next) => {
    try {
      const projects = await Project.find({ isFeatured: true });
      res.status(200).json({
        result: projects,
        status: true,
        msg: "featured projects retrieved successfully",
      });
    } catch (error) {
      next({
        result: error,
        status: false,
        msg: error.message,
      });
    }
  };

  updateMainImage = async (req, res, next) => {
    try {
      const projectId = req.params.id; // Get the project ID from the URL parameters
      const { selectedMainImage } = req.body; // Get the new main image from the request body
  
      if (!selectedMainImage || !selectedMainImage._id) {
        return res.status(400).json({
          result: null,
          status: false,
          msg: "New main image is required and must include an ID",
        });
      }
  
      // Find the project by ID
      const project = await Project.findById(projectId);
  
      if (!project) {
        return res.status(404).json({
          result: null,
          status: false,
          msg: "Project not found",
        });
      }
  
      // Check if the new main image _id is in the list of images
      const isImageInList = project.images.some(image => image._id.toString() === selectedMainImage._id);
  
      if (!isImageInList) {
        return res.status(400).json({
          result: null,
          status: false,
          msg: "Selected image is not part of the project images",
        });
      }
  
      // Update the main image to the image with the selected _id
      project.mainImage = project.images.find(image => image._id.toString() === selectedMainImage._id);
  
      // Save the updated project
      const updatedProject = await project.save();
  
      return res.status(200).json({
        result: updatedProject,
        status: true,
        msg: "Main image updated successfully",
      });
    } catch (error) {
      console.error(error);
      next({
        result: error,
        status: 500,
        msg: "Server error! Unable to update main image",
      });
    }
  };

}

export default projectController;
