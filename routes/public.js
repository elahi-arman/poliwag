const path = require("path");
const fs = require("fs/promises");

const respond = require("./respond");

const fileExtensionToContentType = {
  ".html": "text/html",
  ".css": "text/css",
  ".png": "image/png",
  ".gif": "image/gif",
  ".jpeg": "image/jpeg",
  ".js": "application/javascript",
  ".svg": "image/svg+xml",
};

module.exports = (req, res) => {
  const url = new URL(req.headers.host + req.url);
  const pathname = url.pathname;
  const pathAfterMount = pathname.substring(
    pathname.indexOf(req.app.public.mount) + 1
  );
  const browserPath = pathAfterMount.split("/");
  const localPath = path.resolve(req.app.public.local, ...browserPath);

  if (!localPath) {
    respond.sendNotFound(res);
  }

  return fs
    .readFile(localPath)
    .then(function (contents) {
      const fileExtension = path.extname(localPath);

      res.headers["Content-Type"] = fileExtensionToContentType[fileExtension];
      return respond.sendOk(res, contents);
    })
    .catch((err) => {
      if (err.code === "ENOENT") {
        return respond.sendNotFound(res);
      }
      return respond.sendInternalServerError(res, err);
    });
};
