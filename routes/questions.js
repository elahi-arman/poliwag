const respond = require("./respond");
const handlers = require("./questionHandlers");

module.exports = (req, res) => {
  return req.method === "GET"
    ? handlers.listQuestion(req, res)
    : respond.sendMethodNotAllowed(res);
};
