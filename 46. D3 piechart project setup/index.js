const form = document.querySelector("form");
const name = document.querySelector("#name");
const casenumber = document.querySelector("#casenumber");
const error = document.querySelector("#error");

// var auth = firebase.auth();
// var promise = auth.createUserWithEmailAndPassword(
//   "abc@gmail.com",
//   "abc123321sdk"
// );
// // If there is any error stop the process.
// promise.catch(function(error) {
//   var errorCode = error.code;
//   console.log(`GOT ERROR: ` + errorCode);
//   if (errorCode == "auth/weak-password") return; // password to weak. Minimal 6 characters
//   if (errorCode == "auth/email-already-in-use") return; // Return a email already in use error
// });

// // When no errors create the account
// promise.then(function() {
//   var userUid = auth.currentUser.uid;
//   var db = firebase.firestore();

//   console.log("uid:", userUid);
//   db.collection("users")
//     .doc(userUid)
//     .set({
//       email: "abc@gmail.com",
//       emailVertified: false,
//       name: "htmlUser",
//       online: false,
//       onlock: false,
//       password: "abc123321sdk"
//     });
// });

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
