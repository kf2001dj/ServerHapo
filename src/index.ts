import express from "express";
import { connectDatabase } from "./datasource/DataCourse";
import userRouter from "./routers/UserRouter";

const app = express();

app.use(express.json());

app.use("/api/users", userRouter);




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
