const { codes: storageErrors } = require("../storage/errors");
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
    .getQuestion(req.params.id)
    .then((question) => {
      if (question === null) {
        return respond.sendNotFound(res);
      }
      return respond.sendOk(res, question);
    })
    .catch((err) => {
      if (err.code === storageErrors.NOT_FOUND) {
        return respond.sendInternalServerError(res, {
          err: `Question cache wasn't found`,
        });
      }

      if (err.code === storageErrors.JSON_ERROR) {
        return respond.sendInternalServerError(res, {
          err: `Question ${req.params.id} is malformed JSON`,
        });
      }

      return respond.sendInternalServerError(res, { err });
    });
};
