import jwt from "jsonwebtoken";
import User from "../models/user.model.js";


const authMiddleware = async (req, res, next) => {
    let token;

    // Extract token from headers
    if (req.headers["authorization"]) {
      token = req.headers["authorization"];
    }

    if (req.headers["x-xsrf-token"]) {
      token = req.headers["x-xsrf-token"];
    }

    // Extract token from query parameter
    if (req.query && req.query.token) {
      token = req.query.token;
    }

    // if no toke is provided, return error
    if (!token) {
      return res.status(400).json({
        result: null,
        status: false,
        msg: "login required",
      });
    }

    // console.log(token);

    //split the token if it is prefixed with Bearer
    token = token.split(" ");

    if (token.length > 1) {
      token = token[token.length - 1];
    } else {
      token = token[0];
    }

    try {
      const data = jwt.verify(token, process.env.JWT_SECRET_KEY);

      const userData = await User.findOne({ username: data.username }).select({
        password: 0,
      });

      // if user not found
      if (!userData) {
        return res.status(404).json({
          result: null,
          status: false,
          msg: "Unauthorized. User not found",
        });
      }

      req.token = token;
      req.user = userData;
      
      next();
    } catch (error) {
      next({
        result: null,
        status: 401,
        msg: "Unauthorized! Invalid token",
      });
    }
  };

export default authMiddleware;
