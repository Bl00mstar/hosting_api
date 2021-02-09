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
  getFolders: (array) => {
    return array
      .map((el) => {
        let pwd = "/root" + el.path + el.name;
        return pwd.split("/").slice(1);
      })
      .reduce((children, path) => insert(children, path), []);
  },
  getIp: (req) => {
    let addressIp;
    if (typeof req.headers["x-forwarded-for"] !== "undefined") {
      addressIp = req.headers["x-forwarded-for"];
    } else if (typeof req.connection.remoteAddress !== "undefined") {
      addressIp = req.connection.remoteAddress;
    } else {
      addressIp = req.socket.remoteAddress;
    }
    return addressIp;
  },
};

function insert(children = [], [head, ...tail]) {
  let child = children.find((child) => child.name === head);
  if (!child) children.push((child = { name: head, children: [] }));
  if (tail.length > 0) insert(child.children, tail);
  return children;
}
