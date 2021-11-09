const fs = require("fs").promises;
const ksuid = require("ksuid");
const Question = require("../../models/Question");

module.exports =
  (file, questionCache) =>
  ({ author, question, lecture, isAnonymous }) => {
    return ksuid.random().then((id) => {
      const question = Question({ author, question, lecture, isAnonymous });
      questionCache[id] = question;
      return fs.writeFile(file, questionCache).then(() => question);
    });
  };
