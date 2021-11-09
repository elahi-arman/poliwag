const fs = require("fs").promises;
const ksuid = require("ksuid");
const Question = require("../../models/Question");

module.exports =
  (file, questionCache) =>
  ({ author, question, lecture, isAnonymous }) => {
    return ksuid.random().then((id) => {
      const q = Question({
        id: id.string,
        author,
        question,
        lecture,
        isAnonymous,
      });
      questionCache[id.string] = q;
      return fs.writeFile(file, JSON.stringify(questionCache)).then(() => q);
    });
  };
