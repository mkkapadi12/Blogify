const mongoose = require("mongoose");

const connectMongoDb = (url) => {
  mongoose
    .connect(url)
    .then(() => console.log("Successful connect MongoDB"))
    .catch((err) => console.log(err));
};

module.exports = {
  connectMongoDb,
};
