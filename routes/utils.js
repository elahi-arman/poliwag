const isAlpha = (letter) => letter.match(/[A-z]/) !== null;

const convertSnakeToCamelCase = (key) => {
  let updatedKey = "";
  for (let i = 0; i < key.length; i++) {
    const current = key.charAt(i);
    const next = key.charAt(i + 1);

    // remove underscore and convert next character
    // to uppercase version
    if (current === "_" && isAlpha(next)) {
      updatedKey += next.toUpperCase();
      i++;
    } else {
      updatedKey += current;
    }
  }

  return updatedKey;
};

const normalizeBody = (body) => {
  return Object.entries(body).reduce((previousValue, [key, value]) => {
    const normalizedKey = convertSnakeToCamelCase(key);
    previousValue[normalizedKey] = value;

    return previousValue;
  }, {});
};

const readBody = function (req) {
  return new Promise(function (resolve) {
    let body = [];
    req
      .on("data", (chunk) => {
        body.push(chunk);
      })
      .on("end", () => {
        resolve(Buffer.concat(body).toString());
      });
  });
};

module.exports = {
  normalizeBody,
  readBody,
};
