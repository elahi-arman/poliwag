const searchParameters = new URLSearchParams(window.location.search);
const lecture = searchParameters.get("lecture");

const hasVoter = (question, voter) => question.voters[voter];

const createQuestion = (question) => {
  const template = document.querySelector("#question-template");
  const clone = template.content.cloneNode(true);
  const voteCount = clone.querySelector(".js-vote-count");
  voteCount.innerText = question.votes;

  clone.querySelector(".question-text").innerText = question.question;

  setVoteIconVisibility(clone, hasVoter(question, "arman"));
  setAnsweredIconVisibility(clone, question.resolvedAt !== null);

  return clone;
};

const setVoteIconVisibility = (questionElement, hasVoted) => {
  const downvoteIcon = questionElement.querySelector(".downvote-wrapper");
  const upvoteIcon = questionElement.querySelector(".upvote-wrapper");

  if (hasVoted) {
    downvoteIcon.classList.remove("hidden");
    upvoteIcon.classList.add("hidden");
  } else {
    downvoteIcon.classList.add("hidden");
    upvoteIcon.classList.remove("hidden");
  }
};

const setAnsweredIconVisibility = (questionElement, answered) => {
  if (answered) {
    questionElement.querySelector(".js-answered").classList.remove("invisible");
  } else {
    questionElement.querySelector(".js-answered").classList.add("invisible");
  }
};

const onVote = (questionElement, id) => () => {
  fetch(`/api/question/${id}/upvote`)
    .then((response) => (response.ok ? response.json() : Promise.reject()))
    .then((updatedQuestion) => {
      questionElement.querySelector(".js-vote-count").innerText =
        updatedQuestion.votes;
      setVoteIconVisibility(
        questionElement,
        hasVoter(updatedQuestion, "arman")
      );
    });
};

const submitQuestion = (questionsWrapperElement, lecture) => (event) => {
  const button = event.currentTarget;
  const input = button.previousElementSibling;
  const question = input.value;

  if (!question) {
    input.classList.add("error");
    return;
  }

  fetch("/api/question", {
    method: "POST",
    body: JSON.stringify({
      lecture,
      author: "arman",
      question,
    }),
  })
    .then((response) => (response.ok ? response.json() : Promise.reject()))
    .then((newQuestion) => {
      const child = createQuestion(newQuestion);
      questionsWrapperElement.insertBefore(
        child,
        questionsWrapperElement.querySelector("details:first-of-type")
      );

      input.value = "";
    });
};

if (lecture) {
  document.title = `Lecture ${lecture} Questions`;
  const mainHeading = document.querySelector("main h1");
  mainHeading.innerText = `Lecture ${lecture} Questions`;
  fetch(`/api/questions?lecture=${lecture}`)
    .then((response) => (response.ok ? response.json() : Promise.reject()))
    .then((questions) => {
      const main = document.querySelector("main");
      const submitQuestionButton = document.querySelector(
        ".submit-question button"
      );

      submitQuestionButton.addEventListener(
        "click",
        submitQuestion(main, lecture)
      );

      for (const question of questions) {
        const child = createQuestion(question);
        main.appendChild(child);

        // some weirdness with templates and appendChild so have to requery
        // https://developer.mozilla.org/en-US/docs/Web/API/Node/appendChild
        const newQuestion = main.querySelector("details:last-of-type");
        newQuestion
          .querySelector("button.js-vote")
          .addEventListener("click", onVote(newQuestion, question.id));
      }
    })
    .catch(() => {});
}
