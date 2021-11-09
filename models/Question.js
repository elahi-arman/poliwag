module.exports = ({ author, question, lecture, isAnonymous }) => ({
  author,
  question,
  lecture,
  isAnonymous,
  acceptedAnswer: null,
  createdAt: new Date().now(),
  resolvedAt: null,
  modifiedAt: null,
  voters: {},
  // assume the author voted for their own question
  votes: 1,
  answers: [],
});
