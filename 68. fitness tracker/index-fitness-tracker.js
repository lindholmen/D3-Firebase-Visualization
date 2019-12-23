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
  });
});
