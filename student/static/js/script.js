function validateRegistration() {

    let username =
        document.getElementById("username").value;

    let password =
        document.getElementById("password").value;


    if (username.length < 4) {

        alert("Username must contain at least 4 characters");

        return false;
    }


    if (password.length < 6) {

        alert("Password must contain at least 6 characters");

        return false;
    }


    return true;
}
