const http = require("http");
const fs = require("fs").promises;
const chalk = require("chalk");
const pathToRegexp = require("path-to-regexp");
const { alwaysOK } = require("./routes/test.js");
const Routes = require("./routes");

const RoutingTable = {
  "/login": alwaysOK,
  "/logout": alwaysOK,
  "/question": alwaysOK,
  "/question/:id": alwaysOK,
};

const routeRequest = function (req) {
  const pathname = req.url;

  let nestedRoute = null;
  let bestMatch = { matchedRoute: "", params: {} };

  for (const route of Object.keys(RoutingTable)) {
    const match = pathToRegexp.match(route)(pathname);

    if (match) {
      const isNewMatchMoreSpecific =
        Object.keys(bestMatch.params).length < Object.keys(match.params).length;

      if (isNewMatchMoreSpecific || !nestedRoute) {
        nestedRoute = RoutingTable[route];
        bestMatch.params = match.params;
        bestMatch.matchedRoute = route;
      }
    }
  }

  for (const [param, value] of Object.entries(bestMatch.params)) {
    req.params[param] = value;
  }

  return nestedRoute;
};

const requestListener = (appState) => (req, res) => {
  if (req.url) {
    req.params = {};
    req.log = {};
    req.appState = appState;

    const handler = routeRequest(req);
    if (typeof handler === "function") {
      handler(req, res);
      console.log(req.log);
      return;
    }
  }

  res.statusCode = 404;
  res.end();
};

if (require.main === module) {
  if (process.argv.length < 3) {
    console.log(
      chalk.red(
        "No config file provided. Verify your start script in package.json has 1 argument."
      )
    );
    process.exit(1);
  }

  fs.readFile(process.argv[2])
    .then((rawConfig) => {
      const parsedConfig = JSON.parse(rawConfig);
      return {
        questionsFile: parsedConfig.questionsFile.replace(
          "{dirname}",
          __dirname
        ),
        port: parsedConfig.port,
      };
    })
    .catch((err) => {
      if (err instanceof SyntaxError) {
        console.log(
          chalk.red(
            "Config file couldn't be decoded as JSON. Try putting the contents into https://jsonlint.com/"
          )
        );
        process.exit(1);
      } else if (err.code === "ENOENT") {
        console.log(
          chalk.red(
            `Could not find file ${process.argv[2]}. Verify that it exists.`
          )
        );
        process.exit(1);
      } else {
        console.error(
          "Unhandled error while trying to read questions file",
          err
        );
      }
    })
    .then((config) => {
      const server = http.createServer(
        requestListener({
          questionsFile: config.questionsFile,
          loggedInUsers: {},
        })
      );
      console.log("server is listening :D", { port: config.port });
      server.listen(config.port);
    })
    .catch((err) => {
      console.log(err);
      process.exit(2);
    });
}
