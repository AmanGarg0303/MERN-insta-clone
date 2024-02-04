import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import bodyParser from "body-parser";
import cors from "cors";
import AuthRoute from "./routes/auth.js";
import UserRoute from "./routes/users.js";
import PostRoute from "./routes/posts.js";
import UploadRoute from "./routes/upload.js";
import cookieParser from "cookie-parser";

const app = express();
dotenv.config();

app.use(bodyParser.json({ limit: "30mb", extended: true }));
app.use(bodyParser.urlencoded({ limit: "30mb", extended: true }));
app.use(cors());
app.use(cookieParser());

mongoose.connect(
  process.env.MONGO_URI,
  {
    useNewUrlParser: true,
  },
  (err) => {
    if (!err) {
      console.log("MongoDB Connection Succeeded.");
    } else {
      console.log("Error in DB connection: " + err);
    }
  }
);
mongoose.connection.on("disconnected", () => {
  console.log("mongoDb disconnected!");
});

mongoose.connection.on("connected", () => {
  console.log("mongoDb connected!");
});

// to serve images inside public folder
app.use(express.static("public"));
app.use("/images", express.static("images"));

app.use((err, req, res, next) => {
  const status = err.status || 500;
  const message = err.message || "Something went wrong! ";
  return res.status(status).json({
    success: false,
    status,
    message,
  });
});

app.use("/api/auth", AuthRoute);
app.use("/api/users", UserRoute);
app.use("/api/posts", PostRoute);
app.use("/api/upload", UploadRoute);

app.listen(process.env.PORT, () => {
  console.log("Server is running on port", process.env.PORT);
});
