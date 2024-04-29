import { v2 as cloudinary } from "cloudinary";
import fs from "fs";
import dotenv from "dotenv";
dotenv.config();
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});
let updloadFileToCloud = async (filepath) => {
  try {
    if (!filepath) return null;
    let response = await cloudinary.uploader.upload(
      "https://upload.wikimedia.org/wikipedia/commons/a/ae/Olympic_flag.jpg",
      { resource_type: "auto" }
    );
    console.log("file was uploaded succesfully", response.url);
    return response;
  } catch (e) {
    console.log("file upload on aws error", e);
    fs.unlinkSync(filepath);
    return null;
  }
};
export { updloadFileToCloud };
