const respond = require("./respond");

module.exports = {
  login: respond.sendOk,
  logout: respond.sendOk,
  question: require("./question"),
  listQuestions: require("./questions"),
  catchErrors: respond.sendInternalServerError,
};
