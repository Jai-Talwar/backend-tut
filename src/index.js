import connectDB from "./db/index.js";
import { app } from "./app.js";
connectDB()
  .then(() => {
    app.listen(process.env.PORT || 3000);
  })
  .catch((e) => {
    console.log("mongoDB connection failed", e);
  });
