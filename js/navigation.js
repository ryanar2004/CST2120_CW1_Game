const loginLink = document.getElementById("loginLink");
const registerLink = document.getElementById("registerLink");
const loggedInUser = document.getElementById("loggedInUser");
const logoutButton = document.getElementById("logoutButton");

function updateNavigation() {

    const currentUser = JSON.parse(
        localStorage.getItem("cyberEscapeCurrentUser") || "null"


    );

    if (currentUser) {

        loginLink.hidden = true;
        registerLink.hidden = true;
        loggedInUser.hidden = false;
        loggedInUser.textContent = "Welcome, " + currentUser.username;

        logoutButton.hidden = false;

    } else {

        loginLink.hidden = false;
        registerLink.hidden = false;

        loggedInUser.hidden = true;
        loggedInUser.textContent = "";

        logoutButton.hidden = true;

    }

}


/*logging out*/

logoutButton.addEventListener("click", function() {

    localStorage.removeItem("cyberEscapeCurrentUser");

    updateNavigation();

    window.location.href = "index.html";

});

updateNavigation();

window.addEventListener("cyberEscapeUserChanged", updateNavigation);

