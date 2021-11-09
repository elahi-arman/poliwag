const respond = require("./respond");

module.exports = (req, res) => {
  if (!req.params || !req.params.id) {
    return respond.sendInternalServerError(
      res,
      500,
      "Params should have been assigned but wasn't from /question/:id"
    );
  }
  return req.app.storage
    .upvoteQuestion(req.params.id, "arman")
    .then((question) => {
      if (question === null) {
        return respond.sendNotFound(res);
      }
      return respond.sendOk(res, question);
    })
    .catch((err) => {
      return respond.sendInternalServerError(res, { err });
    });
};
