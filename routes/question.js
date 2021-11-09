const respond = require("./respond");
const handlers = require("./questionHandlers");
const testHandlers = require("./test");

module.exports = (req, res) => {
  // since this path handles /question and /question/:id have to
  // separately check which route was actually matched
  if (req.url === "/question") {
    return req.method === "POST"
      ? handlers.createQuestion(req, res)
      : respond.sendMethodNotAllowed(res);
  }

  if (!req.params || !req.params.id) {
    return respond.sendInternalServerError(
      res,
      500,
      "Params should have been assigned but wasn't from /question/:id"
    );
  }

  switch (req.method) {
    case "GET":
      return handlers.getQuestion(req, res);
    case "PUT":
      return testHandlers.alwaysOK(req, res);
    case "DELETE":
      return testHandlers.alwaysOK(req, res);
    default:
      return respond.sendMethodNotAllowed(res);
  }
};
