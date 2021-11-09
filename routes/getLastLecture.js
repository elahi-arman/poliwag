const respond = require("./respond");

module.exports = (req, res) => {
  if (req.method !== "GET") {
    return respond.sendMethodNotAllowed(res);
  }

  return req.app.storage.listQuestions().then((allQuestions) => {
    const lectureCount = Object.values(allQuestions).reduce(
      (previousMax, question) => Math.max(question.lecture, previousMax),
      0
    );
    return respond.sendOk(res, { count: lectureCount });
  });
};
