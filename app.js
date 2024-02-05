import dotenv from "dotenv";
dotenv.config();
import express from "express";
import cors from "cors";
import connectDB from "./config/connectdb.js";
import userRoutes from "./routes/userRoutes.js";

import bodyParser from "body-parser";

const app = express();
app.use(bodyParser.json());
const port = process.env.PORT;

//CORS Policy
app.use(cors());

//Database Connection
connectDB;

//JSON
app.use(express.json());

//Load Routes
app.use("/", userRoutes);

app.listen(port, () => {
  console.log(`server listening at http://localhost:${port}`);
});
