const config = require("./jest.config");
config.testPathIgnorePatterns = ["/node_modules/", "/src/main/"];
module.exports = config;
