module.exports = {
  codes: {
    NOT_FOUND: "STORAGE.NOT_FOUND_ERROR",
    JSON_ERROR: "STORAGE.JSON_CORRUPTED",
    UNKNOWN: "STORAGE.UNKNOWN",
  },
  NotFoundError: (err, message) =>
    Promise.reject({
      code: this.codes.NOT_FOUND,
      message,
      err,
    }),
  JSONError: (err, tag) =>
    Promise.reject({
      code: this.codes.JSON_ERROR,
      message: `JSON for ${tag} is corrupted`,
      err,
    }),
  UNKNOWN: (err) =>
    Promise.reject({
      code: this.codes.UNKNOWN,
      message: "Caught an UNKNOWN error ",
      err,
    }),
};
