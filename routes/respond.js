const http = require("http");

const send = (res, statusCode, body = null) => {
  res.log.status = statusCode;

  if (body && res.statusCode !== 500) {
    try {
      const responseBody = JSON.stringify(body);
      res.log.response = responseBody;
      res.writeHead(statusCode, http.STATUS_CODES[statusCode]);
      res.write(responseBody);
    } catch (err) {
      if (err instanceof SyntaxError) {
        res.log.status = 500;
        res.writeHead(500);
      }
    }
  } else {
    res.writeHead(statusCode);

    if (res.statusCode === 500) {
      res.log.error = body;
    }
  }

  res.end();
  return Promise.resolve({
    statusCode,
    body,
  });
};

module.exports = {
  sendOk: (res, body) => send(res, 200, body),
  sendCreated: (res, body) => send(res, 201, body),
  sendDeleteConfirmation: (res) => send(res, 204),
  sendBadRequest: (res, error) => send(res, 400, { error }),
  sendUnauthorized: (res) => send(res, 403),
  sendNotFound: (res) => send(res, 404),
  sendMethodNotAllowed: (res) => send(res, 405),
  sendInternalServerError: (res, error) => send(res, 500, { error }),
};
