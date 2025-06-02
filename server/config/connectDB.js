const mongoose = require("mongoose");

async function connectDB() {
  try {
    // Connect to MongoDB using the URI from environment variables
    await mongoose.connect(process.env.MONGODB_URI, {
    });

    const connection = mongoose.connection;

    connection.on("connected", () => {
      console.log("✅ MongoDB connected");
    });

    connection.on("error", (error) => {
      console.error("❌ MongoDB connection error:", error);
    });

    connection.on("disconnected", () => {
      console.warn("⚠️ MongoDB disconnected");
    });

  } catch (error) {
    console.error("❌ Failed to connect to MongoDB:", error.message);
    process.exit(1);
  }
}

module.exports = connectDB;
