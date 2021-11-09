const http = require("http");
const fs = require("fs").promises;
const chalk = require("chalk");
const pathToRegexp = require("path-to-regexp");

const routes = require("./routes");
const initializeFileStorage = require("./storage/file");

const routeRequest = function (req) {
  const path = req.url;

  const bestMatch = { matchedRoute: "", params: {}, handler: null };

  for (const [route, handler] of Object.entries(routes)) {
    const match = pathToRegexp.match(route)(path);

    if (match) {
      const hasMorePaths =
        bestMatch.matchedRoute.split("/").length < match.path.split("/").length;

      const hasMoreParams =
        Object.keys(bestMatch.params).length < Object.keys(match.params).length;

      const isNewMatchMoreSpecific = hasMorePaths || hasMoreParams;

      if (isNewMatchMoreSpecific || bestMatch.handler === null) {
        bestMatch.handler = handler;
        bestMatch.params = match.params;
        bestMatch.matchedRoute = route;
      }
    }
  }

  for (const [param, value] of Object.entries(bestMatch.params)) {
    req.params[param] = value;
  }

  req.log.path = bestMatch.matchedRoute;
  req.log.params = req.params;
  return bestMatch.handler;
};

const requestListener = (appState) => (req, res) => {
  req.log = {
    status: 404,
    path: req.url,
  };
  req.params = {};
  req.app = appState;

  res.log = req.log;
  res.headers = {};

  const handler = routeRequest(req);
  if (typeof handler === "function") {
    return handler(req, res)
      .catch((err) => routes.catchErrors(res, err))
      .then(() => console.log(req.log));
  }

  req.log.error = `No handler registered for ${req.url}`;
  res.statusCode = 404;
  res.end();

  console.log(req.log);
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
        public: {
          mount: parsedConfig.public.mount,
          local: parsedConfig.public.local.replace("{dirname}", __dirname),
        },
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
      return initializeFileStorage(config.questionsFile).then((storage) => {
        const server = http.createServer(
          requestListener({
            storage,
            loggedInUsers: {},
            public: config.public,
          })
        );
        console.log("server is listening :D", { port: config.port });
        server.listen(config.port);
      });
    })
    .catch((err) => {
      console.log(err);
      process.exit(2);
    });
}
