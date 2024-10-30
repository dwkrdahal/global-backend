import Team from "../models/team.model.js";

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

      // console.log("files",req.files);
      
      if (req.files.avatar && req.files.avatar?.length > 0) {
        const avatarFile = req.files.avatar[0];
        avatar.url = avatarFile?.path;
        avatar.caption = avatarFile?.originalname;
      }

      if (req.files.cover && req.files.cover?.length > 0) {
        const coverFile = req.files.cover[0];
        cover.url = coverFile?.path;
        cover.caption = coverFile?.originalname;
      }

      const team = new Team({
        ...data,
        avatar,
        cover,
      })
      const newTeam = await team.save();

      res.status(201).json({
        result: newTeam,
        status: true,
        msg: "team member added"
      })
    } catch (error) {
      console.log(error);

      next({
        result: error,
        status: false,
        msg: "error while creating team",
      });
    }
  };

  updateTeamById = async (req, res, next) => {
    try {
      const data = req.body;
      const teamId = req.params.id;

      const team = await Team.findById(teamId)
      if(!team){
        return res.status(404).json({
          result: null,
          status: false,
          msg: "team member not found",
        });
      }

      let {avatar, cover} = team;
      console.log(req.files);
      

      if(req.files.avatar && req.files.avatar?.length > 0){
        const avatarFile = req.files.avatar[0];
        avatar.url = avatarFile.path;
        avatar.caption = avatarFile.originalname
      }

      if(req.files.cover && req.files.cover?.length > 0){
        const coverFile = req.files.cover[0];
        cover.url = coverFile.path;
        cover.caption = coverFile.originalname
      }

      const updatedTeam = await Team.findByIdAndUpdate(
        teamId,
        { ...data, avatar, cover },
        { new: true }
      );

      if (!updatedTeam) {
        return res.status(404).json({
          result: null,
          status: false,
          msg: "team member not found",
        });
      }

      res.status(200).json({
        result: updatedTeam,
        status: true,
        msg: "team member updated successfully!",
      });
    } catch (error) {
      console.log(error);

      next({
        result: error,
        status: false,
        msg: "error while editing team",
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
