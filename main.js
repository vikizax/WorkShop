// get the form reference from the DOM
const form = document.querySelector("form");
const loadingSpinner = document.querySelector(".loading");
const tweetsHolder = document.querySelector("#content-tweets");

// firebase
const firestore = firebase.firestore();

// when the page loads spinner will be set to be hidden
loadingSpinner.style.display = "none";

// users tweets global store
let tweets = [];

// firebase
let unsubscribe = null;

// IIFE
(() => {
  // get the subs
  unsubscribe = firestore.collection("post").onSnapshot(doc => {
    let innerHtml = "";
    doc.docs.forEach(docData => {
      innerHtml += `<div class="text-center mt-4"><h2>${
        docData.data().iam
      }</h2><p>${docData.data().content}</p></div>`;
    });
    tweetsHolder.innerHTML = innerHtml;
  });
})();

// function to add data to the db
const addToDb = meow => {
  // add the post to the firestore db
  firestore
    .collection("post")
    .add(meow)
    .then(ref => {
      if (ref.id) {
        form.style.display = "";
        loadingSpinner.style.display = "none";
        tweetsHolder.style.display = "";
        form.reset();
      }
    })
    .catch(err => {
      alert(err.message);
    });
};

// add event listener to the form
form.addEventListener("submit", event => {
  // form will be hidden and spinner will be shown
  form.style.display = "none";
  loadingSpinner.style.display = "";
  tweetsHolder.style.display = "none";
  // prevent the default behaviour of the form on submit
  event.preventDefault();
  // get the formData obj
  const formData = new FormData(form);
  // get the data from the input iam
  const iam = formData.get("iam");
  // get the data from the input content
  const content = formData.get("content");

  // store the obtained data as object
  const meow = {
    iam,
    content
  };

  // form validation
  iam.length > 0 && content.length > 0
    ? addToDb(meow) // call the addTODb
    : alert("Please fill in all the fields");
});

window.onclose(ev => {
  unsubscribe();
});
