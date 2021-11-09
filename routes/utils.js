const isAlpha = (letter) => letter.match(/[A-z]/) !== null;

const convertSnakeToCamelCase = (key) => {
  const updatedKey = "";
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
};

const normalizeBody = (body) => {
  return Object.entries(body).reduce((previousValue, [key, value]) => {
    const normalizedKey = convertSnakeToCamelCase(key.toLowerCase());
    previousValue[normalizedKey] = value;

    return previousValue;
  }, {});
};

module.exports = {
  normalizeBody,
};
