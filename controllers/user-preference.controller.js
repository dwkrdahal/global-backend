import UserPreference from "../models/user-preference.model.js";

class UserPreferenceController {
  // Default preferences and settings
  defaultPreferences = {
    theme: "light",
    language: "en",
    notifications: true,
  };

  defaultSettings = {
    emailNotifications: true,
    smsNotifications: false,
  };

  getorCreatePreference = async (req, res, next) => {
    try {
      const userId = req.user._id;
      let userPreference = await UserPreference.findOne({ user: userId });

      if (!userPreference) {
        userPreference = new UserPreference({
          user: userId,
          preferences: this.defaultPreferences,
          settings: this.defaultSettings,
        });
        await userPreference.save();
      }

      res.status(200).json({
        result: userPreference,
        status: true,
        msg: "User preferences retrieved successfully",
      });
    } catch (error) {
      console.log(error);
      next({
        result: error,
        status: false,
        msg: "error getting preference",
      });
    }
  };

  createOrUpdatePreference = async (req, res, next) => {
    try {
      const userId = req.user._id;
      const { preferences, settings } = req.body;

      const result = await UserPreference.findOneAndUpdate(
        { user: userId },
        { preferences, settings },
        { new: true, upsert: true }
      );

      res.status(200).json({
        result: result,
        status: true,
        msg: "preference updated",
      });
    } catch (error) {
      next({
        result: error,
        status: false,
        msg: "error updating preferences",
      });
    }
  };
}

export default UserPreferenceController;
