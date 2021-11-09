const chalk = require("chalk");
const fs = require("fs").promises;
const __createQuestion = require("./createQuestion");
const __getQuestion = require("./getQuestion");
const __listQuestion = require("./listQuestions");
const __upvoteQuestion = require("./upvoteQuestion");
const __resolveQuestion = require("./resolveQuestion");
const __archiveQuestion = require("./archiveQuestion");

const initializeStorage = (questionsFile, questionCache) => {
  return {
    createQuestion: __createQuestion(questionsFile, questionCache),
    getQuestion: __getQuestion(questionsFile, questionCache),
    listQuestions: __listQuestion(questionCache),
    resolveQuestion: __resolveQuestion(questionsFile, questionCache),
    upvoteQuestion: __upvoteQuestion(questionsFile, questionCache),
    archiveQuestion: __archiveQuestion(questionsFile, questionCache),
  };
};

module.exports = (questionsFile) => {
  return fs
    .readFile(questionsFile, "utf-8")
    .then((contents) => {
      const parsedContents = JSON.parse(contents);

      // first condition handles null, undefined
      // second condition handles arrays
      // third condition handlese everything else
      if (
        !contents ||
        Array.isArray(contents) ||
        !(parsedContents instanceof Object)
      ) {
        throw new SyntaxError(`Questions File must be an Object`);
      }

      // initialize our questionCache with the contents of the file
      return initializeStorage(questionsFile, parsedContents);
    })
    .catch((err) => {
      if (err instanceof SyntaxError) {
        console.log(
          chalk.red(
            `Questions File is malformed JSON, could not load questions from file: ${questionsFile}`
          )
        );
      } else if (err.code === "ENOENT") {
        console.log(
          chalk.yellow(
            `Questions file does not exist. Creating it now: ${questionsFile}`
          )
        );
        const emptyCache = {};
        return fs
          .writeFile(questionsFile, JSON.stringify(emptyCache))
          .then(() => initializeStorage(questionsFile, emptyCache));
      } else {
        console.error(
          "Unhandled error while trying to read questions file",
          err
        );
      }

      return Promise.reject(err);
    });
};
