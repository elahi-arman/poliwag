const fs = require("fs").promises;

module.exports = (file, entries, entry, isDelete = false) => {
  if (!isDelete) {
    entries[entry.id] = entry;
  }
  fs.writeFile(file, JSON.stringify(entries, null, 2));
  return entry;
};
