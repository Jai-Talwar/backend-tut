import jwt from "jsonwebtoken";
import apiError from "../utils/apiError.js";
import { User } from "../models/user.model.js";
const verifyJWT = async (req, _, next) => {
  try {
    const token =
      req.cookies?.accessToken ||
      req.header("Authorization")?.replace("Bearer ", "");
    console.log(token);
    if (!token) {
      throw new apiError(401, "Unauthorised request");
    }
    const decodedtoken = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
    const user = await User.findById(decodedtoken?._id).select(
      "-password -refreshToken"
    );
    if (!user) {
      throw new apiError(401, "Invalid Acess Token");
    }
    req.user = user;
    console.log(user);
    next();
  } catch (error) {
    console.log(error);
  }
};
export { verifyJWT };
