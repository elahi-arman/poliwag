const fs = require("fs").promises;
const { NotFoundError, JSONError, UnknownError } = require("../errors");

module.exports = (file, questionCache) => (id) => {
  if (questionCache[id]) {
    // create a Promise that immediately resolves so
    // the caller doesn't have to worry about whether
    // this value is a Promise or not.
    return Promise.resolve(questionCache[id]);
  }

  return fs
    .readFile(file)
    .then((contents) => {
      const questions = JSON.parse(contents);
      return questions[id] || null;
    })
    .catch((err) => {
      if (err.code === "ENOENT") {
        return NotFoundError(
          "Questions file was not found and cache is uninitialized."
        );
      } else if (err instanceof SyntaxError) {
        return JSONError(err, flie);
      }

      return UnknownError(err);
    });
};
