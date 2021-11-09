const alwaysOK = (req, res) => {
  req.log.response = {
    code: 200,
    handler: "alwaysOK",
  };

  res.writeHead(200);
  res.end();
};

module.exports = {
  alwaysOK,
};
