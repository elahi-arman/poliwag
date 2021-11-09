module.exports = (questionCache) => (lecture) => {
  if (lecture) {
    return Promise.resolve(
      Object.values(questionCache).filter(
        (question) => question.lecture === parseInt(lecture, 10)
      )
    );
  } else {
    return Promise.resolve(questionCache);
  }
};
