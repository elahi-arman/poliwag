const storage = require("../../storage/file");
const { codes: storageErrors } = require("../../storage/errors");
const respond = require("../respond");

module.exports = (req, res) => {
  return storage
    .getQuestion(req.params.id)
    .then((question) => {
      return respond.sendOk(res, question);
    })
    .catch((err) => {
      if (err.code === storageErrors.NOT_FOUND) {
        return respond.sendNotFound(res);
      }

      if (err.code === storageErrors.JSON_ERROR) {
        return respond.sendInternalServerError(
          res,
          `Question ${req.params.id} is malformed JSON`
        );
      }

      return respond.sendInternalServerError(res, { err });
    });
};
