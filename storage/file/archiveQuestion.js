const resolveEntry = require("./readEntry");
const commitEntry = require("./writeEntry");

module.exports = (file, questionCache) => (id) => {
  return resolveEntry(file, questionCache, id).then((entry) => {
    if (entry === null) {
      return null;
    }

    delete questionCache[id];

    return commitEntry(file, questionCache, entry, true);
  });
};
