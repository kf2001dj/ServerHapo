import express from "express";
import { connectDatabase } from "./datasource/DataCourse";
import userRouter from "./routers/UserRouter";
import bodyParser from "body-parser";

const app = express();

app.use(express.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.use("/api/users", userRouter);

app.use("/api/signin", userRouter);

app.use("/api/signin/status", userRouter);

app.use("/api/signout", userRouter);

app.get("/", (req, res) => {
  res.send("Hello Thanh Dong, Express with TypeORM!");
});

connectDatabase()
  .then(() => {
    app.listen(4000, () => {
      console.log("Server is running on port 4000");
    });
  })
  .catch((error) => {
    console.error("Error connecting to the database:", error);
  });
