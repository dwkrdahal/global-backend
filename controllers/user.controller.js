import User from "../models/user.model.js";

class userController {
  // get all users list
  getAllUsers = async (req, res, next) => {
    try {
      const users = await User.find();
      if (!users) {
        res.status(404).json({
          result: users,
          status: true,
          msg: "Users not found",
        });
      } else {
        res.status(200).json({
          result: users,
          status: true,
          msg: "Users retrived successfully",
        });
      }
    } catch (error) {
      next({
        result: error,
        status: 400,
        msg: "An error occurred while retrieving users",
      });
    }
  };

  //get single user by ID
  getUserById = async (req, res, next) => {
    try {
      const id = req.params.id;
      const user = await User.findOne({ _id: id });
      if (!user) {
        res.status(404).json({
          result: null,
          status: false,
          msg: "User not found",
        });
      } else {
        res.status(200).json({
          result: user,
          status: true,
          msg: "User retrived",
        });
      }
    } catch (error) {
      next({
        result: error,
        status: 400,
        msg: "An error occurred while retrieving the user",
      });
    }
  };

  //update profile
  updateProfile = async (req, res, next) => {
    const { email, fullName, contactNumber, address, avatar } = req.body;

    try {
      const data = {
        email: email,
        "profile.fullName": fullName,
        "profile.contactNumber": contactNumber,
        "profile.address": address,
        "profile.avatar": avatar,
      };

      const emailExist = await User.findOne({ email: data.email });

      if (emailExist && data.email !== req.user.email)
        return res.status(400).json({
          result: { email: data.email },
          status: false,
          msg: "Email already registered",
        });

      const user = await User.findByIdAndUpdate(
        { _id: req.user._id },
        { $set: data },
        { new: true, runValidators: true }
      );

      if (!user) {
        return res.status(404).json({
          result: null,
          status: false,
          msg: "User not found",
        });
      } else {
        return res.status(200).json({
          result: user,
          status: true,
          msg: "user profile updated",
          token: await user.generateToken()
        });
      }
    } catch (error) {
      next({
        result: error,
        status: false,
        msg: "error while updating profile",
      });
    }
  };

  //update user by id
  updateUserById = async (req, res, next) => {
    try {
      const id = req.params.id;
      const data = req.body;
      const user = await User.findByIdAndUpdate(id, data, {
        new: true,
        runValidators: true,
      });

      if (!user) {
        res.status(404).json({
          result: null,
          status: true,
          msg: "User not found",
        });
      } else {
        res.status(200).json({
          result: user,
          status: true,
          msg: "User updated",
        });
      }
    } catch (error) {
      next({
        result: error,
        status: 400,
        msg: "An error occured while updating a user",
      });
    }
  };

  //bulk update
  bulkUpdate = async (req, res, next) => {
    try {
      const { filter, update } = req.body;
      const result = await User.updateMany(filter, update, {
        new: true,
        runValidators: true,
      });

      if (result.modifiedCount === 0) {
        res.status(404).json({
          result: null,
          status: true,
          msg: "user not found",
        });
      } else {
        res.status(200).json({
          result: result,
          status: true,
          msg: `${result.modifiedCount} Users updated`,
        });
      }
    } catch (error) {
      console.log(error);
      next({
        result: error,
        status: 400,
        msg: "An error occured while updating users",
      });
    }
  };

  //delete user by id
  deleteUserById = async (req, res, next) => {
    try {
      const id = req.params.id;    
      
      // cannot delete currently logged in user
      // if(id == req.user._id){
      //   return res.status(401).json({
      //     result: null,
      //     status: false,
      //     msg: "logged in user cannot be deleted!"
      //   })
      // }

      const user = await User.findByIdAndDelete(req.user._id);

      if (!user) {
        res.status(404).json({
          result: null,
          status: true,
          msg: "User not found",
        });
      } else {
        res.status(200).json({
          result: user,
          status: true,
          msg: "User deleted successfully",
        });
      }
    } catch (error) {
      next({
        result: error,
        status: 400,
        msg: "An error occured while deleting the user",
      });
    }
  };

  //bulk delete by filter or array of ids
  bulkDelete = async (req, res, next) => {
    try {
      let filter = req.body;

      if (Array.isArray(filter) && ids.length === 0) {
        filter = { _id: { $in: filter } };
      }

      const result = await User.deleteMany(filter);

      if (result.deletedCount === 0) {
        res.status(404).json({
          result: null,
          status: true,
          msg: "User not found",
        });
      } else {
        res.status(200).json({
          result: result,
          status: true,
          msg: `${result.deletedCount} Users deleted`,
        });
      }
    } catch (error) {
      next({
        result: error,
        status: 400,
        msg: "An error occured while deleting multiple users",
      });
    }
  };

  //deleteAll
  deleteAllUsers = async (req, res, next) => {
    try {
      const result = await User.deleteMany({});

      if (result.deletedCount === 0) {
        res.status(404).json({
          result: null,
          status: false,
          msg: "user not found",
        });
      } else {
        res.status(200).json({
          result: result,
          status: true,
          msg: `All ${result.deletedCount} users deleted`,
        });
      }
    } catch (error) {
      next({
        result: error,
        status: 400,
        msg: "An error occured while deleting all users",
      });
    }
  };
}

export default userController;
