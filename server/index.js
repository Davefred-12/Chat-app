const express = require("express");
const cors = require("cors");
require("dotenv").config();
const connectDB = require("./config/connectDB");
const router = require("./routes/index.js");
const cookieParser = require("cookie-parser");
const { app, server } = require("./socket/index.js");

// const app = express();
app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  })
);
app.use(express.json());
app.use(cookieParser());
const PORT = process.env.PORT || 8000;

app.get("/", (req, res) => {
  res.json({
    message: "Server running at " + PORT,
  });
});

//API endpoint
app.use("/api", router);

connectDB().then(() => {
  server.listen(PORT, () => {
    console.log("Server running at " + PORT);
  });
});
