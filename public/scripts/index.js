const main = () => {
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
};

main();
