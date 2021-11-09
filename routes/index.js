const respond = require("./respond");

module.exports = {
  "/(.*)": require("./public"),
  "/api/login": require("./login"),
  "/api/logout": respond.sendOk,
  "/api/question": require("./createQuestion"),
  "/api/question/:id": require("./getQuestion"),
  "/api/question/:id/upvote": require("./upvoteQuestion"),
  "/api/question/:id/resolve": require("./resolveQuestion"),
  "/api/question/:id/archive": require("./archiveQuestion"),
  "/api/questions(.*)?": require("./listQuestions"),
  "/api/lastLecture": require("./getLastLecture"),
  catchErrors: respond.sendInternalServerError,
};
