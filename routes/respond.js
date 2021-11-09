const http = require("http");

const send = (res, statusCode, body) => {
  if (body) {
    try {
      const responseBody = JSON.stringify(body);
      res.writeHead(res.status, http.STATUS_CODES[statusCode]);
      res.write(responseBody);
    } catch (err) {
      if (err instanceof SyntaxError) {
        res.writeHead(500);
      }
    }
  }

  res.end();
};

module.exports = {
  sendOk: (res, body) => send(res, 200, body),
  sendCreated: (res, body) => send(res, 201, body),
  sendDeleteConfirmation: (res) => send(res, 204),
  sendBadRequest: (res, error) => send(res, 400, { error }),
  sendUnauthorized: (res) => send(res, 403),
  sendNotFound: (res) => send(res, 404),
  sendMethodNotAllowed: (res) => send(res, 405),
  sendInternalServerError: (res) => send(res, 500),
};
