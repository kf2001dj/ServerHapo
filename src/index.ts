import express from "express";
import { connectDatabase } from "./datasource/DataCourse";
import userRouter from "./routers/UserRouter";
import bodyParser from "body-parser";
import courseRouter from "./routers/CourseRouter";
// import courseUserPr from "./routers/CourseUserPrRouter";

const cors = require("cors");
const app = express();

app.use(
  cors({
    origin: "http://localhost:3000",
    credentials: true,
  })
);

app.use(express.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.use("/", userRouter);

app.get("/", (req, res) => {
  res.send("Hello Thanh Dong, Express with TypeORM!");
});

app.use("/all", courseRouter);

// app.use("/profile", courseUserPr);

connectDatabase()
  .then(() => {
    app.listen(5000, () => {
      console.log("Server is running on port 5000");
    });
  })
  .catch((error) => {
    console.error("Error connecting to the database:", error);
  });
