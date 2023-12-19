const { PORT } = require("./constants/config.constant.js");
const app = require("./libs/express.lib.js");
const port = PORT || 3000;

async function run() {
  try {
    await require("./config/db").connect();
    app.listen(port, "0.0.0.0", () => {
      console.log(`Application is running on port ${port}`);
    });
  } catch (err) {
    console.log(err);
  }
}

run();
