module.exports = ({ id, author, question, lecture, isAnonymous }) => ({
  id,
  author,
  question,
  lecture: parseInt(lecture, 10),
  isAnonymous,
  acceptedAnswer: null,
  createdAt: Date.now(),
  resolvedAt: null,
  modifiedAt: null,
  voters: {},
  // assume the author voted for their own question
  votes: 1,
  answers: [],
});
