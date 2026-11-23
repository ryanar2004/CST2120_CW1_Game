
/*getting the login form and message element */

const loginForm = document.getElementById("loginForm");
const loginMessage = document.getElementById("loginMessage");

/*function to display messages */

function showMessage(message, type) {
    loginMessage.textContent = message;
    loginMessage.className = type;
}

/*function to check the users pass*/

async function hashPassword(password, salt) {
    const passwordBytes = new TextEncoder().encode(password);

    const key = await crypto.subtle.importKey(
        "raw", passwordBytes, "PBKDF2", false, ["deriveBits"]
    );

    const hash = await crypto.subtle.deriveBits(
        {
            name: "PBKDF2",
            salt: new TextEncoder().encode(salt),
            iterations: 100000,
            hash: "SHA-256"
        },
        key,
        256
    );

    return Array.from(new Uint8Array(hash))
        .map(byte => byte.toString(16).padStart(2, "0"))
        .join("");
}



loginForm.addEventListener("submit", async function(event) {

    event.preventDefault();

    

    const username = document.getElementById("loginUsername").value.trim().toLowerCase();
    const password = document.getElementById("loginPassword").value;

  

    if (!username || !password) {
        showMessage("Please fill in all fields", "error-message");
        return;
    }

  

    const users = JSON.parse(localStorage.getItem("cyberEscapeUsers") || "[]");



    const user = users.find(account =>
        account.username.toLowerCase() === username ||
        account.email.toLowerCase() === username
    );

    /*to check if account exists*/

    if (!user) {
        showMessage("Incorrect username, email or password", "error-message");
        return;
    }

  

    const passwordHash = await hashPassword(password, user.salt);

    if (passwordHash !== user.passwordHash) {
        showMessage("Incorrect username, email or password", "error-message");
        return;
    }

  

    const currentUser = {
        id: user.id,
        username: user.username,
    };

    localStorage.setItem("cyberEscapeCurrentUser", JSON.stringify(currentUser));

    window.dispatchEvent(new Event("cyberEscapeUserChanged"));

    

    showMessage("Login successful! Welcome back, " + user.username, "success-message");

    loginForm.reset();

});
