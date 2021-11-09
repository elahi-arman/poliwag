fetch("/api/lastLecture")
  .then((response) => (response.ok ? response.json() : Promise.reject()))
  .then(({ count }) => {
    const lectureList = document.querySelector("nav ul");
    const lectureTemplate = document.querySelector("#lecture-template");

    for (let i = 0; i < count; i++) {
      const clone = lectureTemplate.content.cloneNode(true);
      const link = clone.querySelector("a");
      link.href = `/lecture.html?lecture=${i}`;
      link.innerText = `Lecture ${i}`;
      lectureList.appendChild(clone);
    }
  })
  .catch(() => {});

const getUser = () => {
  const userCookie = document.cookie
    .split(";")
    .filter((cookie) => cookie.trimStart().startsWith("user"))[0];
  const rawUserInfo = decodeURIComponent(
    userCookie.substring(userCookie.indexOf("=") + 1)
  );

  return JSON.parse(rawUserInfo);
};

getUser();
