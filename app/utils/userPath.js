const config = require("config");
module.exports = {
  getPath: (user, type) => {
    let pathToFolder = config.get("storagePath") + user + type;
    return pathToFolder;
  },
};
