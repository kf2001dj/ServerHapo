import express from "express";
import { connectDatabase } from "./datasource/DataCourse";
import userRouter from "./routers/UserRouter";
import bodyParser from "body-parser";
import courseRouter from "./routers/CourseRouter";

const app = express();

app.use(express.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.use("/", userRouter);

app.get("/", (req, res) => {
  res.send("Hello Thanh Dong, Express with TypeORM!");
});

app.use("/all", courseRouter);

connectDatabase()
  .then(() => {
    app.listen(4000, () => {
      console.log("Server is running on port 4000");
    });
  })
  .catch((error) => {
    console.error("Error connecting to the database:", error);
  });
