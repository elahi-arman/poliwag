const resolveEntry = require("./readEntry");
const commitEntry = require("./writeEntry");

module.exports = (file, questionCache) => (id, voter) => {
  return resolveEntry.then((entry) => {
    const now = Date.now();
    entry.modifiedAt = now;

    if (entry.voters[voter]) {
      entry.voters[voter] = 0;
      entry.votes -= 1;
    } else {
      entry.voters[voter] = 1;
      entry.votes += 1;
    }

    questionCache[id] = entry;
    return commitEntry(file, questionCache, entry);
  });
};
