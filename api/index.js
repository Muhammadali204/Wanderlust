const serverless = require("serverless-http");
const app = require("../app"); // path to your Express app

module.exports.handler = serverless(app);