const respond = require("./respond");

const normalizedBodyKeys = (body) => {
  for (const [key, value] of Object.entries(body)) {
    const normalizedKey = key.toLowerCase();
    body[key.toLowerCase()] = value;
  }
};

const REQUIRED_CREATE_QUESTION_KEYS = ["author", "isAnonymous", "lecture"];
const createQuestion = (req, res) => {
  if (!req.body) {
    respond.sendBadRequest(res, "No request body was passed in");
  }

  let parsedBody;
  try {
    parsedBody = JSON.parse(req.body);
  } catch (err) {
    if (err instanceof SyntaxError) {
      return respond.sendBadRequest(
        res,
        "Request body could not be decoded as JSON"
      );
    }

    return respond.sendInternalServerError(res);
  }
};

module.exports = (req, res) => {
  switch (req.method) {
    case "GET":
      return handlePost(req, res);
    case "POST":
      return createQuestion(req, res);
    case "PUT":
      return handlePost(req, res);
    case "DELETE":
      return handlePost(req, res);
    default:
      return respond.sendMethodNotAllowed(res);
  }
};
