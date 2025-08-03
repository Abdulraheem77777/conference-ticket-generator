class conferenceTiket {
  constructor() {
    this._parentElement = document.querySelector(".form");
    this._fullNameInput = document.getElementById("fullname");
    this._emailInput = document.getElementById("email");
    this._avatarInput = document.getElementById("avatar");
    this._githubInput = document.getElementById("github");

    this._handleForm(); //Listen for form submission
    this._handleAvatarInput(); // ✅ Listen for file selection
  }

  _handleForm() {
    this._parentElement.addEventListener(
      "submit",
      this._onSubmitProcess.bind(this)
    );
  }

  _handleAvatarInput() {
    //replace icon 📩 for icon ✅ if successsful immediately
    this._avatarInput.addEventListener(
      "change",
      this._validateAvatar.bind(this)
    );
  }

  _validateAvatar() {
    const avatar = this._avatarInput.files[0]; //select the avatarinput
    const uploadIcon = document.querySelector(".upload-label .upload-icon"); //select the icon
    const parent = document.querySelector(".upload-label"); //select the label

    // ✅ Remove any old success emoji
    document.querySelectorAll(".success-emoji").forEach((el) => el.remove());

    // ✅ If no file selected
    if (!avatar) {
      uploadIcon.style.display = "block"; //return to former icon
      return;
    }

    // ✅ Invalid file type
    if (!["image/png", "image/jpeg"].includes(avatar.type)) {
      uploadIcon.style.display = "block"; //return to former icon
      return;
    }

    // ✅ File too big
    if (avatar.size > 512000) {
      uploadIcon.style.display = "block"; //return to former icon
      return;
    }

    // ✅ Valid file: show emoji
    uploadIcon.style.display = "none"; //remove former icon  if succesful

    const successEmoji = document.createElement("span"); //create new icon
    successEmoji.textContent = "✅";
    successEmoji.classList.add("success-emoji");

    const uploadText = document.querySelector(".upload-text");
    uploadText.textContent = "Image uploaded successfully";
    parent.appendChild(successEmoji); //add to the label
  }

  _showTicket(data, avatarFile) {
    //show section
    const ticket = document.getElementById("ticket");
    ticket.classList.remove("hidden");

    //set success message
    const h1 = document.querySelector("h1");

    h1.innerHTML = `Congrats, <span class="highlight">${data.fullname}!</span> </br> Your ticket is ready`;
    const h3 = document.querySelector("h3");
    h3.innerHTML = `we’ve emailed it to </br><a class="highlight" href="${data.email}">${data.email}</a> and will send updates in </br>the run up to the event.`;
    const ticketName = document.querySelector(".ticket-name");
    ticketName.textContent = `${data.fullname}`;

    const ticketHub = document.querySelector(".ticket-hub");
    // ticketHub.appendChild(icons);
    ticketHub.innerHTML = `<img src="assets/images/icon-github.svg" alt="user github icon" class="github-icon"/> @${data.github}`;

    // Update avatar
    //URL.createObjectURL creates a local link for the browser to be able to access the user's image
    const avatarURL = URL.createObjectURL(avatarFile);
    document.getElementById("ticket-avatar").src = avatarURL;

    // // Set ticket name and GitHub
    // const ticketName = document.getElementById("ticket-name");
    // const ticketGithub = document.getElementById("ticket-github");

    // ticketName.textContent = data.fullname;
    // ticketGithub.textContent = `@${data.github}`;
  }
  _onSubmitProcess(e) {
    e.preventDefault();

    this._clearErrors();

    const formData = [...new FormData(this._parentElement)];
    const data = Object.fromEntries(formData);

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/; //email validation
    let isValid = true;

    //validating the fullname
    if (!data.fullname.trim()) {
      this._showError(this._fullNameInput, "Please enter a valid full name");
      isValid = false;
    }

    //validating the email
    if (!emailRegex.test(data.email)) {
      this._showError(this._emailInput, "Please enter a valid email address");
      isValid = false;
    }

    //validating the github

    if (!data.github.trim()) {
      this._showError(
        this._githubInput,
        "Please enter a valid GitHub username"
      );
      isValid = false;
    }

    //validating the avatar(uploaded image)

    const avatar = this._avatarInput.files[0];
    if (!avatar || !["image/png", "image/jpeg"].includes(avatar.type)) {
      this._showError(this._avatarInput, "Only JPG or PNG files allowed");
      isValid = false;
    } else if (avatar.size > 512000) {
      this._showError(this._avatarInput, "Image too large. Max 500KB");
      isValid = false;
    }

    if (!isValid) return;
    this._parentElement.innerHTML = "";
    this._showTicket(data, avatar);
  }

  _showError(inputEl, message) {
    const errorHTML = `<div class="error-msg"><img src="assets/images/icon-info.svg" alt="error icon" class="error-icon"><span>${message}</span></div>`;
    //if error is avatar input
    const parent =
      inputEl === this._avatarInput
        ? inputEl.closest(".avatar-upload") //DIV THAT WRAPS THE INPUT(put the error there)
        : //if error is not avatar input(email/fullname ad github)
          inputEl.parentElement; //put the error under the input(parentElement)

    //if error is not avatar input(email/fullname ad github)
    if (inputEl !== this._avatarInput) {
      inputEl.style.outline = "2px solid hsl(7, 100%, 60%)"; //put this color
    }
    parent.insertAdjacentHTML("beforeend", errorHTML); //put the error into the DOM
  }

  //clear the former errors before process again
  _clearErrors() {
    document.querySelectorAll(".error-msg").forEach((el) => el.remove());
    document.querySelectorAll("input, text").forEach((input) => {
      input.style.outline = "none";
    });
  }
}

const app = new conferenceTiket();
// _showError(inputEl, message) {
//   const errorDiv = document.createElement("div");
//   errorDiv.classList.add("error-msg");

//   // Make the error message screen-reader friendly
//   errorDiv.setAttribute("role", "alert");
//   errorDiv.setAttribute("aria-live", "assertive");

//   const icon = document.createElement("img");
//   icon.src = "assets/images/icon-info.svg";
//   icon.alt = "Error icon";
//   icon.classList.add("error-icon");

//   const msg = document.createElement("span");
//   msg.textContent = message;

//   errorDiv.appendChild(icon);
//   errorDiv.appendChild(msg);

//   const parent =
//     inputEl === this._avatarInput
//       ? inputEl.closest(".avatar-upload")
//       : inputEl.parentElement;

//   if (inputEl !== this._avatarInput)
//     inputEl.style.outline = "2px solid hsl(7, 100%, 60%)";

//   parent.appendChild(errorDiv);
// }
