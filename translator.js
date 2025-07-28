const fromText = document.querySelector(".from-text");
const toText = document.querySelector(".to-text");
const translateBtn = document.querySelector("button");
const selectTag = document.querySelectorAll("select");
const exchageIcon = document.querySelector(".exchange");
const icons = document.querySelectorAll(".icons i");

// Default values
const defaultLanguages = ["en-GB", "hi-IN"];

selectTag.forEach((tag, index) => {
  for (const code in countries) {
    const option = document.createElement("option");
    option.value = code;
    option.textContent = countries[code];
    if (code === defaultLanguages[index]) {
      option.selected = true;
    }
    tag.appendChild(option);
  }
  tag.addEventListener("change", () => {
    console.log(`selected: ${tag.value}`);
  });
});

translateBtn.addEventListener("click", () => {
  let text = fromText.value.trim();
  const translateFrom = selectTag[0].value;
  const translateTo = selectTag[1].value;
  if (!text) return;
  toText.setAttribute("placeholder", "Translating...");
  let apiUrl = `https://api.mymemory.translated.net/get?q=${text}&langpair=${translateFrom}|${translateTo}`;
  fetch(apiUrl)
    .then((res) => res.json())
    .then((data) => {
      toText.value = data.responseData.translatedText;
      data.matches.forEach((data) => {
        if (data.id === 0) {
          toText.value = data.translation;
        }
      });
      toText.setAttribute("placeholder", "Translation");
    });
});

exchageIcon.addEventListener("click", () => {
  if (!fromText.value) {
    toText.value = "";
  }
  // swap text value
  let tempText = fromText.value;
  fromText.value = toText.value;
  toText.value = tempText;
  // swap dropdown value
  let tepLang = selectTag[0].value;
  selectTag[0].value = selectTag[1].value;
  selectTag[1].value = tepLang;
});

icons.forEach((icon) => {
  icon.addEventListener("click", ({ target }) => {
    const type = target.dataset.type; // "from" or "to"

    if (target.classList.contains("fa-copy")) {
      const textToCopy = type === "from" ? fromText.value : toText.value;
      if (textToCopy) {
        navigator.clipboard
          .writeText(textToCopy)
          .then(() => console.log("Copied:", textToCopy))
          .catch((err) => console.error("Copy error:", err));
      }
    } else if (target.classList.contains("fa-volume-up")) {
      let utterance;
      if (type === "from" && fromText.value) {
        utterance = new SpeechSynthesisUtterance(fromText.value);
        utterance.lang = selectTag[0].value;
      } else if (type === "to" && toText.value) {
        utterance = new SpeechSynthesisUtterance(toText.value);
        utterance.lang = selectTag[1].value;
      }
      if (utterance) speechSynthesis.speak(utterance);
    }
  });
});
