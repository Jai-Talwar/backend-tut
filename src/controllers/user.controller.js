import apiError from "../utils/apiError.js";
import { User } from "../models/user.model.js";
import { updloadFileToCloud } from "../utils/fileUpload.js";
const registerUser = async (req, res) => {
  const { fullName, email, username, password } = req.body;
  console.log("email: ", email);
  if (
    [fullName, email, username, password].some((item) => {
      item?.trim() === "";
    })
  ) {
    throw new apiError(400, "all fields are neccessary");
  }
  const existerUser = User.findOne({
    $or: [{ username }, { email }],
  });
  if (existerUser) {
    throw new apiError(409, "user exists with this email");
  }
  const avatarLocalPath = req.files?.avatar[0]?.path;
  const impageLocalPath = req.files?.coverImage[0]?.path;
  if (!avatarLocalPath) {
    throw new apiError(400, "Avatar file is required");
  }
  const avatar = await updloadFileToCloud(avatarLocalPath);
  const image = await updloadFileToCloud(impageLocalPath);
  if (!avatar) {
    throw new apiError(400, "Avatar file is required");
  }
  let user = await User.create({
    fullName,
    avatar: avatar.url,
    coverImage: image?.url || "",
    email,
    password,
    username: username.toLowerCase(),
  });
  const createdUser = User.findById(user._id).select("-password -refreshToken");
  if (!createdUser) {
    throw new apiError(500, "something went wrong while registring the user");
  }
  res.status(201).send({
    message: "user registered succesfully",
    data: createdUser,
  });
};
export { registerUser };
