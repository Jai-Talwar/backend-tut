import express from "express";
import cors from "cors";
import userRoute from "./routes/user.route.js";
let app = express();
app.use(express.json());
app.use(cors());
app.use(express.static("public"));
app.use(express.urlencoded()); //this is used to decode the url data as data in url like params are somewhat encoded
app.use("/api/v1/users", userRoute);
export { app };
