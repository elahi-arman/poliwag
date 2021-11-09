const storage = require("../../storage/file");

const REQUIRED_CREATE_QUESTION_KEYS = [
  "author",
  "question",
  "isAnonymous",
  "lecture",
];

module.exports = (req, res) => {
  if (!req.body) {
    return respond.sendBadRequest(res, "No request body was passed in");
  }

  let parsedBody;
  try {
    parsedBody = JSON.parse(req.body);
    req.log.keys = Object.keys(parsedBody);
  } catch (err) {
    if (err instanceof SyntaxError) {
      return respond.sendBadRequest(
        res,
        "Request body could not be decoded as JSON"
      );
    }

    return respond.sendInternalServerError(res);
  }

  const normalizedBody = normalizeBody(parsedBody);
  req.log.normalizedKeys = Object.keys(normalizedBody);

  for (const key of REQUIRED_CREATE_QUESTION_KEYS) {
    if (!normalizedBody[key]) {
      return respond.sendBadRequest(res, `${key} is required but not found`);
    }
  }

  return storage
    .createQuestion(normalizedBody)
    .then((question) => {
      return respond.sendCreated(res, question);
    })
    .catch((err) => {
      req.log.err = err;
      return respond.sendInternalServerError(res);
    });
};
