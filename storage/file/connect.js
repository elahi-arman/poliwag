const fs = require("fs").promises;
const __createQuestion = requirie("./createQuestion");

module.exports = (questionsFile) => {
  fs.readFile(questionsFile)
    .then((contents) => {
      // initialize our questionCache with the contents of the file
      const questionCache = JSON.parse(contents);

      return {
        createQuestion: __createQuestion(questionsFile, questionCache),
      };
    })
    .catch((err) => {
      if (err instanceof SyntaxError) {
        console.log(
          chalk.red(
            `Questions File is malformed JSON, could not load questions from file: ${questionsFile}`
          )
        );
        return err;
      } else if (err.code === "ENOENT") {
        console.warn(
          `Questions file does not exist. Creating it now: ${questionsFile}`
        );
        return fs.writeFile(questionsFile, JSON.stringify({}));
      } else {
        console.error(
          "Unhandled error while trying to read questions file",
          err
        );
      }
    });
};
