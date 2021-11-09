const url = require("url");
const { codes: storageErrors } = require("../../storage/errors");
const respond = require("../respond");

module.exports = (req, res) => {
  const query = url.parse(req.url, true).query;
  const term = query.lecture;

  return req.app.storage
    .listQuestions(term)
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
