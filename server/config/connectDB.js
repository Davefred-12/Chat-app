const mongoose = require("mongoose");

async function connectDB() {
  try {
    const connection = mongoose.connection;

    connection.on("connected", () => {
      console.log("DB Connected");
    });

    connection.on("error", (error) => {
      console.log("MongoDB connection error: ", error);
    });

    connection.on("disconnected", () => {
      console.log("MongoDB disconnected");
    });

    await mongoose.connect(process.env.MONGODB_URI);

  } catch (error) {
    console.log("Failed to connect to MongoDB:", error.message);
    process.exit(1);
  }
}

module.exports = connectDB;