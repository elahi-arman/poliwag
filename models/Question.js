module.exports = ({ id, author, question, lecture }) => ({
  id,
  author,
  question,
  lecture: parseInt(lecture, 10),
  acceptedAnswer: null,
  createdAt: Date.now(),
  resolvedAt: null,
  modifiedAt: null,
  voters: {
    [author]: 1,
  },
  // assume the author voted for their own question
  votes: 1,
  answers: [],
});
