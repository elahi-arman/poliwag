module.exports = {
  login: (req, res) => {
    console.log(req, res);
    res.writeHead(200);
    res.end();
  },
  logout: (req, res) => {
    console.log(req, res);
    res.writeHead(200);
    res.end();
  },
};
