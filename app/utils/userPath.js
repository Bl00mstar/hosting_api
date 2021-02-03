const config = require("config");
module.exports = {
  getPath: (user, type) => {
    let pathToFolder = config.get("storagePath") + user + type;
    return pathToFolder;
  },
  getExtension: (file) => {
    let getExtension = file.name.split(".");
    let extension = getExtension.pop();
    return extension;
  },
};
