import express from "express";
import cors from "cors";
import userRoute from "./routes/user.route.js";
import cookieParser from "cookie-parser";
let app = express();
app.use(cookieParser());
app.use(express.json());
app.use(cors());
app.use(express.static("public"));
app.use(express.urlencoded()); //this is used to decode the url data as data in url like params are somewhat encoded
app.use("/api/v1/users", userRoute);
export { app };
