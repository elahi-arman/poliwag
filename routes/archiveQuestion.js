const respond = require("./respond");

module.exports = (req, res) => {
  if (req.method !== "DELETE") {
    return respond.sendMethodNotAllowed(res);
  }

  if (!req.params || !req.params.id) {
    return respond.sendInternalServerError(
      res,
      500,
      "Params should have been assigned but wasn't from /question/:id"
    );
  }

  return req.app.storage.archiveQuestion(req.params.id).then((question) => {
    if (question === null) {
      return respond.sendNotFound(res);
    }
    return respond.sendDeleteConfirmation(res, question);
  });
};
