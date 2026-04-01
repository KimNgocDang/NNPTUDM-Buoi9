const mongoose = require("mongoose");

async function connectDB() {
  try {
    await mongoose.connect("mongodb://127.0.0.1:27017/cnpm");
    console.log("Ket noi MongoDB thanh cong");
  } catch (error) {
    console.error("Ket noi MongoDB that bai:", error.message);
    process.exit(1);
  }
}

module.exports = connectDB;