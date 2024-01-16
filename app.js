import express from "express";
import { client } from "./utils/db.js"
import questionRouter from "./apps/questions.js"
import cors from "cors";

async function init() {
  const app = express();
  const port = 4000;

  try {
    await client.connect();
  } catch {
    console.log("connect db error");
  }
  app.use(cors());

  app.use(express.json());
  app.use(express.urlencoded({ extended: false }));


  app.use("/questions", questionRouter);

  app.listen(port, () => {
    console.log(`Server is listening on port ${port}`);
  });
}

init();
