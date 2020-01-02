// Dom elements
const btns = document.querySelectorAll("button");
console.log(btns);
const form = document.querySelector("form");
const formActivity = document.querySelector("form span");
const input = document.querySelector("input");
const error = document.querySelector(".error");

let activity = "Cycling";

btns.forEach(btn => {
  btn.addEventListener("click", e => {
    // get activity
    activity = e.target.dataset.activity; // target. dataset.x to get attribute value of data-x

    // remove and add active class
    btns.forEach(btn => btn.classList.remove("active"));
    e.target.classList.add("active");

    // set id to the activity
    input.setAttribute("id", activity);
    //console.log("id: ", input.getAttribute("id"));

    formActivity.innerHTML = activity;

    // call update function
    update(fitnessData);
  });
});

// form submit
form.addEventListener("submit", e => {
  e.preventDefault();

  const distance = parseInt(input.value);

  if (distance) {
    db.collection("activities")
      .add({
        distance,
        activity,
        date: new Date().toString()
      })
      .then(() => {
        input.value = "";
        error.innerHTML = "";
        var feedback = document.getElementById("snackbar");
        feedback.className = "show";
        // After 3 seconds, remove the show class from DIV
        setTimeout(function() {
          feedback.className = feedback.className.replace("show", "");
        }, 3000);
      });
  } else {
    error.innerHTML = "input must be valid";
  }
});
