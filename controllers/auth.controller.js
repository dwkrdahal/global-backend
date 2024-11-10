import User from "../models/user.model.js";

class AuthController {
  login = async (req, res, next) => {
    try {
      const data = req.body;

      // checking existence of user
      const userExist = await User.findOne({ username: data.username });
      const emailExist = await User.findOne({ email: data.username });

      if (!(userExist || emailExist)) {
        return res.status(400).json({ 
          result: null,
          status: false,
          msg: "invalid credentials" 
        });
      }

      const user = userExist || emailExist

      if(user.status !== "active"){
        return res.status(401).json({
          result: null,
          status: false,
          msg: "user is not active"
        })
      }

      if(user.approval_status !== "approved"){
        return res.status(401).json({
          result: null,
          status: false,
          msg: "user is not approved by admin"
        })
      }

      // checking password
      const isPasswordValid = await user.comparePassword(data.password);
      if(isPasswordValid){
        res.json({
          result: user,
          status: true,
          msg: "login successful",
          token: await user.generateToken()
        })
      } else{
        return res.status(400).json({ 
          result: null,
          status: false,
          msg: "invalid password" 
        })
      }
    }
    catch (error) {
      // console.log(error);
      next({
        result: error,
        status: 500,
        msg: "Server Error! Login failed",
      });
    }
  };

  register = async (req, res, next) => {
    try {
      let data = req.body;

      // checkig username is in database or not
      const usernameExist = await User.findOne({ username: data.username });
      if (usernameExist) {
        return res.status(400).json({
          result: null,
          status: false,
          msg: "username already taken",
        });
      }

      //checking email in databse to be unique
      const emailExist = await User.findOne({ email: data.email });    
      if (emailExist) {
        return res.status(400).json({
          result: null,
          status: false,
          msg: "email address already registered",
        });
      }

      let user = new User(data);
      const response = await user.save();

      if (response) {
        res.status(201).json({
          result: response,
          status: true,
          msg: "user registered successfully",
        });
      } else{
        res.status(400).json({
          result: null,
          status: false,
          msg: "cannot register this user"
        })
      }
    } catch (error) {
      next({
        result: error,
        status: 500,
        msg: "An error occurred during the registration process",
      });
    }
  };
  
  changePassword = async (req, res, next) => {
    try {
      const { userId, currentPassword, newPassword } = req.body;
  
      // Find the user by userId
      const user = await User.findById(userId);
  
      if (!user) {
        return res.status(404).json({
          result: null,
          status: false,
          msg: "User not found",
        });
      }
  
      // Check if the current password matches
      const isPasswordValid = await user.comparePassword(currentPassword);
      if (!isPasswordValid) {
        return res.status(400).json({
          result: null,
          status: false,
          msg: "Current password is incorrect",
        });
      }
  
      // Update the password field with the new password
      user.password = newPassword;
      await user.save(); // The `pre-save` hook will hash the password automatically
  
      // Respond with a success message
      res.json({
        result: null,
        status: true,
        msg: "Password changed successfully",
      });
  
    } catch (error) {
      console.error(error);
      next({
        result: error,
        status: 500,
        msg: "Server Error! Password change failed",
      });
    }
  };
  
}

export default AuthController;
