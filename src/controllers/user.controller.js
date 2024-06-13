import apiError from "../utils/apiError.js";
import { User } from "../models/user.model.js";
import { updloadFileToCloud } from "../utils/fileUpload.js";
const generateAccessTokenAndRefreshToken = async (userId) => {
  try {
    let user = await User.findById(userId);
    let accessToken = await user.generateAccessToken();
    let refreshToken = await user.generateRefreshToken();
    // console.log(refreshToken);
    user.refreshToken = refreshToken;
    await user.save({ validateBeforeSave: false });
    return { accessToken, refreshToken };
  } catch (e) {
    throw new apiError(500, "some error generated during token generation");
  }
};
const registerUser = async (req, res) => {
  const { fullName, email, username, password } = req.body;
  if (
    [fullName, email, username, password].some((item) => {
      item?.trim() === "";
    })
  ) {
    throw new apiError(400, "all fields are neccessary");
  }
  const existerUser = await User.findOne({
    $or: [{ username }, { email }],
  });
  if (existerUser) {
    throw new apiError(409, "user exists with this email");
  }
  const avatarLocalPath = req.files?.avatar[0]?.path;
  let imageLocalPath;
  if (
    req.files &&
    Array.isArray(req.files.coverImage) &&
    req.files.coverImage.length > 0
  ) {
    imageLocalPath = req.files.coverImage[0].path;
  }
  if (!avatarLocalPath) {
    throw new apiError(400, "Avatar file is required");
  }
  const avatar = await updloadFileToCloud(avatarLocalPath);
  const image = await updloadFileToCloud(imageLocalPath);
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
  const createdUser = await User.findById(user._id).select(
    "-password -refreshToken"
  );
  if (!createdUser) {
    throw new apiError(500, "something went wrong while registring the user");
  }
  res.status(201).send({
    message: "user created",
    data: createdUser,
  });
};
//login user
const loginUser = async (req, res) => {
  const { username, email, password } = req.body;
  if (!(username || email)) {
    throw new apiError(400, "username or email is required");
  }
  let user = await User.findOne({
    $or: [{ username }, { email }],
  });
  if (!user) {
    throw new apiError(400, "user with this credentials doesn't exists");
  }
  let isPasswordValid = await user.isPasswordCorrect(password); //didn't use User but user here becoz User is a mongo model and all mongoose funtions are presented for the User but here we will use user only
  if (!isPasswordValid) {
    throw new apiError(400, "wrong password");
  }
  const { accessToken, refreshToken } =
    await generateAccessTokenAndRefreshToken(user._id);
  let loginUser = await User.findById(user._id).select(
    "-password -refreshToken"
  );
  let options = {
    httpOnly: true,
    secure: true,
  };
  res
    .status(200)
    .cookie("accessToken", accessToken, options)
    .cookie("refreshToken", refreshToken, options)
    .send({
      message: "user logged in",
      accessToken,
      refreshToken,
      loginUser,
    });
};
const logoutUser = async (req, res) => {
  // login me to credentials hote h to login a person with that email and password but in
  // logout kaise kroge no info at all and logout me refresh token bhi delete from db
  try {
    const user = req.user;
    await User.findByIdAndUpdate(
      user._id,
      {
        $unset: {
          refreshToken: 1,
        },
      },
      {
        new: true,
      }
    );
    let options = {
      httpOnly: true,
      secure: true,
    };
    res
      .status(200)
      .clearCookie("accessToken", options)
      .clearCookie("refreshToken", options)
      .send("User logged out");
  } catch (error) {
    throw new apiError(500, error?.message || "some error occured in logout");
  }
};
export { registerUser, loginUser, logoutUser };
