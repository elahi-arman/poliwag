const fs = require("fs").promises;

module.exports = (file, entries, entry) => {
  entries[entry.id] = entry;
  return fs.writeFile(file, JSON.stringify(entries)).then(() => entry);
};
