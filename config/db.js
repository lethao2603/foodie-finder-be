const {
  MONGODB_HOSTNAME,
  MONGODB_PASSWORD,
  MONGODB_USERNAME,
  MONGODB_DATABASE,
} = require("../constants/config.constant.js");
const mongoose = require("mongoose")

const connect = () => {
  new Promise((resolve, reject) => {
    mongoose.connect(
      `mongodb+srv://${MONGODB_USERNAME}:${MONGODB_PASSWORD}@${MONGODB_HOSTNAME}/${MONGODB_DATABASE}?retryWrites=true&w=majority`,
      {
        useCreateIndex: true,
        useNewUrlParser: true,
        useUnifiedTopology: true,
      }
    );

    const db = mongoose.connection;

    db.once("connected", () => {
      console.log("✅ MongoDB: connected!");
      resolve();
    });

    db.on("error", (error) => {
      console.error("❌ MongoDB: error");
      reject(error);
    });
  });
};

module.exports = {connect};
