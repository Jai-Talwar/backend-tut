import express from "express";
import cors from "cors";
let app = express();
app.use(express.json());
app.use(cors());
app.use(express.static("public"));
app.use(express.urlencoded());
app.get("/:id", (req, res) => {
  let id = req.params.id;
  let name = req.query["name"];
  res.send(`hi mongo is connected and your id is ${id} and name is ${name}`);
});
export { app };
