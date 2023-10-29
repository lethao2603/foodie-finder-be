const { SERVER_PORT } = require("./constants/config.constant.js");
const app = require("./libs/express.lib.js");
const port = SERVER_PORT || 3000;

(async () => {
  try {
    let x = 5;
    console.log(x);
    await require("./config/db").connect();
    app.listen(port, "0.0.0.0", () => {
      console.log(`Application is running on port ${port}`);
    });
  } catch (err) {
    console.log(err);
  }
})();