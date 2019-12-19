const form = document.querySelector("#form1");
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

const form2 = document.querySelector("#form2");
const publicationtype = document.querySelector("#publicationtype");
const publicationnumber = document.querySelector("#publicationnumber");
const error2 = document.querySelector("#error2");

form2.addEventListener("submit", e => {
  e.preventDefault();

  if (publicationtype.value && publicationnumber.value) {
    const item = {
      publicationtype: publicationtype.value,
      publicationnumber: parseInt(publicationnumber.value)
    };

    db.collection("publications")
      .add(item)
      .then(res => {
        publicationtype.value = "";
        publicationnumber.value = "";
        error2.textContent = "Data added successfully!";
      });
  } else {
    error2.textContent = "please enter a valid value";
  }
});
