/* getting the form and message element*/ 


const registerForm = document.getElementById("registerForm");
const registerMessage = document.getElementById("registerMessage");

/*the function to display message*/

function showMessage(message, type) {
    registerMessage.textContent = message;
    registerMessage.className = type;
}

/*creating a hash of the users pass*/

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


registerForm.addEventListener("submit", async function(event) {
    
    event.preventDefault();

    /*getting the users info*/

    const username = document.getElementById("username").value.trim();
    const email = document.getElementById("email").value.trim();
    const country = document.getElementById("country").value.trim();
    const password = document.getElementById("password").value;
    const confirmPassword = document.getElementById("confirmPassword").value;


    /*if any empty field it will show error message*/

    if (!username || !email || !country || !password || !confirmPassword) {
        showMessage("Please fill in all fields", "error-message");
        return;
    }


    if (username.length < 3) {
        showMessage("Username must have at least 3 characters", "error-message");
        return;
    }

    /*to check email format*/

    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailPattern.test(email)) {
        showMessage("Please enter a valid email address", "error-message");
        return;
    }


    /*checking pass length*/

    if (password.length < 8) {
        showMessage("Password must be at least 8 characters", "error-message");
        return;
    }

    if (password !== confirmPassword) {
        showMessage("Passwords do not match", "error-message");
        return;
    }

    /*getting existing registered users*/

    const users = JSON.parse(localStorage.getItem("cyberEscapeUsers") || "[]");

    /*to chec if username already exists*/
    const usernameTaken = users.some(user =>
        user.username.toLowerCase() === username.toLowerCase()
    );

    if (usernameTaken) {
        showMessage("This username is already taken", "error-message");
        return;
    }

    /*checking if emaul already exists*/
    const emailTaken = users.some(user =>
        user.email.toLowerCase() === email.toLowerCase()
    );

    if (emailTaken) {
        showMessage("This email is already registered", "error-message");
        return;
    }

    /*creates the new account*/
    const salt = crypto.randomUUID();
    const passwordHash = await hashPassword(password, salt);

    const newUser = {
        id: crypto.randomUUID(),
        username: username,
        email: email,
        country: country,
        salt: salt,
        passwordHash: passwordHash
    };

    /*saving the account in local storage*/
    users.push(newUser);
    localStorage.setItem("cyberEscapeUsers", JSON.stringify(users));

    showMessage("Registration successful", "success-message");
    registerForm.reset();

});


