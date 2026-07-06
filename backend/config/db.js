const mongoose = require("mongoose");

mongoose.set("bufferCommands", false);

const connectDB = async () => {
  try {
    if (!process.env.MONGO_URI) {
      throw new Error("MONGO_URI is missing in .env");
    }

    const connection = await mongoose.connect(process.env.MONGO_URI, {
      serverSelectionTimeoutMS: 10000, // fail fast if Atlas not reachable
      socketTimeoutMS: 45000,
      connectTimeoutMS: 10000,
      maxPoolSize: 10,
      minPoolSize: 1,
      family: 4, // prefer IPv4 to avoid IPv6/DNS weirdness
    });

    console.log(
      `MongoDB Connected: ${connection.connection.host}`
    );

    mongoose.connection.on("connected", () => {
      console.log("Mongoose connected");
    });

    mongoose.connection.on("disconnected", () => {
      console.log("Mongoose disconnected");
    });

    mongoose.connection.on("error", (err) => {
      console.error("Mongoose error:", err.message);
    });
  } catch (error) {
    console.error("MongoDB Connection Failed:", error.message);
    process.exit(1);
  }
};

module.exports = connectDB;