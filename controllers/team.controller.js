import Team from "../models/team.model.js";
import uploadToCloudinary from "../utils/cloudinaryConfig.js";

class teamController {

  // Team count function
  countTeam = async (req, res, next) => {
    try {
      const teamCount = await Team.countDocuments(); // Get total count of teams

      res.status(200).json({
        result: { count: teamCount },
        status: true,
        msg: "success! team count retrieved",
      });
    } catch (error) {
      console.error("Error counting teams:", error);

      next({
        result: error,
        status: false,
        msg: "server error! cannot retrieve team count",
      });
    }
  };

  addTeam = async (req, res, next) => {
    try {
      let data = req.body;
      let avatar = {};
      let cover = {};
  
      // Upload avatar image if provided
      if (req.files.avatar && req.files.avatar.length > 0) {
        const avatarFile = req.files.avatar[0];
        const uploadedAvatar = await uploadToCloudinary(
          avatarFile.buffer,
          "team/avatar"  // Folder path in Cloudinary
        );
        avatar = {
          url: uploadedAvatar.secure_url, // Cloudinary URL
          caption: avatarFile.originalname, // Use original name as caption
        };
      }
  
      // Upload cover image if provided
      if (req.files.cover && req.files.cover.length > 0) {
        const coverFile = req.files.cover[0];
        const uploadedCover = await uploadToCloudinary(
          coverFile.buffer,
          "team/cover"  // Folder path in Cloudinary
        );
        cover = {
          url: uploadedCover.secure_url, // Cloudinary URL
          caption: coverFile.originalname, // Use original name as caption
        };
      }
  
      // Create new team member with avatar and cover
      const team = new Team({
        ...data,
        avatar,
        cover,
      });
      const newTeam = await team.save();
  
      res.status(201).json({
        result: newTeam,
        status: true,
        msg: "Team member added successfully",
      });
    } catch (error) {
      console.error(error);
      next({
        result: error,
        status: false,
        msg: "Error while creating team",
      });
    }
  };

  updateTeamById = async (req, res, next) => {
    try {
      const data = req.body;
      const teamId = req.params.id;
  
      // Find the team member by ID
      const team = await Team.findById(teamId);
      if (!team) {
        return res.status(404).json({
          result: null,
          status: false,
          msg: "Team member not found",
        });
      }
  
      let { avatar, cover } = team;
  
      // Update avatar image if a new one is provided
      if (req.files.avatar && req.files.avatar.length > 0) {
        const avatarFile = req.files.avatar[0];
        const uploadedAvatar = await uploadToCloudinary(
          avatarFile.buffer,
          "team/avatar"  // Folder path in Cloudinary
        );
        avatar = {
          url: uploadedAvatar.secure_url, // Cloudinary URL
          caption: avatarFile.originalname, // Use original name as caption
        };
      }
  
      // Update cover image if a new one is provided
      if (req.files.cover && req.files.cover.length > 0) {
        const coverFile = req.files.cover[0];
        const uploadedCover = await uploadToCloudinary(
          coverFile.buffer,
          "team/cover"  // Folder path in Cloudinary
        );
        cover = {
          url: uploadedCover.secure_url, // Cloudinary URL
          caption: coverFile.originalname, // Use original name as caption
        };
      }
  
      // Update team member with new data and updated avatar and cover
      const updatedTeam = await Team.findByIdAndUpdate(
        teamId,
        { ...data, avatar, cover },
        { new: true }
      );
  
      if (!updatedTeam) {
        return res.status(404).json({
          result: null,
          status: false,
          msg: "Team member not found",
        });
      }
  
      res.status(200).json({
        result: updatedTeam,
        status: true,
        msg: "Team member updated successfully!",
      });
    } catch (error) {
      console.error(error);
      next({
        result: error,
        status: false,
        msg: "Error while updating team member",
      });
    }
  };

  deleteTeam = async (req, res, next) => {
    try {
      const teamId = req.params.id;
      const team = await Team.findByIdAndDelete(teamId);

      if (!team) {
        return res.status(404).json({
          result: null,
          status: false,
          msg: "team member not found",
        });
      }

      res.status(200).json({
        result: team,
        status: true,
        msg: "team member deleted",
      });
    } catch (error) {
      next({
        result: error,
        status: false,
        msg: "error while deleting team",
      });
    }
  };

  getAllTeams = async (req, res, next) => {
    try {
      const teams = await Team.find();

      if (!teams) {
        return res.status(404).json({
          result: null,
          status: false,
          msg: "teams not found",
        });
      }

      res.status(200).json({
        result: teams,
        status: true,
        msg: "team member fetched success!",
      });
    } catch (error) {
      next({
        result: error,
        status: false,
        msg: "error fetching teams",
      });
    }
  };

  getTeamById = async (req, res, next) => {
    try {
      const teamId = req.params.id;
      const team = await Team.findById(teamId);

      if (!team) {
        return res.status(404).json({
          result: null,
          status: false,
          msg: "team member not found",
        });
      }

      res.status(200).json({
        result: team,
        status: true,
        msg: "team member fetched!",
      });
    } catch (error) {
      next({
        result: error,
        status: false,
        msg: "error getting team",
      });
    }
  };
}

export default teamController;
