const respond = require("./respond");

module.exports = {
  "/(.*)": require("./public"),
  "/api/login": respond.sendOk,
  "/api/logout": respond.sendOk,
  "/api/question": require("./createQuestion"),
  "/api/question/:id": require("./getQuestion"),
  "/api/question/:id/upvote": require("./upvoteQuestion"),
  "/api/question/:id/resolve": require("./resolveQuestion"),
  "/api/question/:id/archive": require("./archiveQuestion"),
  "/api/questions(.*)?": require("./listQuestions"),
  "/api/lastLecture": require("./getLastLecture"),
};
