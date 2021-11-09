const resolveEntry = require("./readEntry");
const commitEntry = require("./writeEntry");

module.exports = (file, questionCache) => (id, acceptedResponse) => {
  return resolveEntry.then((entry) => {
    const now = Date.now();

    entry.modifiedAt = now;
    entry.resolvedAt = now;
    entry.response = acceptedResponse;

    return commitEntry(file, questionCache, entry);
  });
};
