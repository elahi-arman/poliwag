const url = require("url");
const respond = require("./respond");

const supportedFilters = ["lecture"];

module.exports = (req, res) => {
  if (req.method !== "GET") {
    return respond.sendMethodNotAllowed(res);
  }

  const query = url.parse(req.url, true).query;

  for (const key of Object.keys(query)) {
    if (!supportedFilters.includes(key)) {
      return respond.sendBadRequest(
        res,
        `${key} is unsupported as a query parameter`
      );
    }
  }

  return req.app.storage
    .listQuestions(query.lecture)
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
