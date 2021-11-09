const { NotFoundError, JSONError, UnknownError } = require("../errors");

module.exports = (file, questionCache, id) => {
  let entry = questionCache[id];
  if (entry) {
    return Promise.resolve(entry);
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
        return JSONError(err, file);
      }

      return UnknownError(err);
    });
};
