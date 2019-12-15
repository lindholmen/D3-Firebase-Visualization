const form = document.querySelector("form");
const name = document.querySelector("#name");
const casenumber = document.querySelector("#casenumber");
const error = document.querySelector("#error");

form.addEventListener("submit", e => {
  e.preventDefault();

  if (name.value && casenumber.value) {
    const item = {
      cause_name: name.value,
      case_number: parseInt(casenumber.value)
    };

    db.collection("accidents")
      .add(item)
      .then(res => {
        name.value = "";
        casenumber.value = "";
        error.textContent = "Data added successfully!";
      });
  } else {
    error.textContent = "please enter a valid value";
  }
});
