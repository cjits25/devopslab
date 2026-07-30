const form = document.getElementById("registrationForm");

form.addEventListener("submit", function(event) {

    event.preventDefault();

    const studentName = document.getElementById("studentName").value.trim();
    const fatherName = document.getElementById("fatherName").value.trim();
    const dob = document.getElementById("dob").value;
    const email = document.getElementById("email").value.trim();
    const phone = document.getElementById("phone").value.trim();
    const college = document.getElementById("college").value.trim();

    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const phonePattern = /^[0-9]{10}$/;

    if (
        studentName === "" ||
        fatherName === "" ||
        dob === "" ||
        email === "" ||
        phone === "" ||
        college === ""
    ) {
        alert("Please fill all mandatory fields.");
        return;
    }

    if (!emailPattern.test(email)) {
        alert("Please enter a valid email address.");
        return;
    }

    if (!phonePattern.test(phone)) {
        alert("Phone number must contain exactly 10 digits.");
        return;
    }

    alert("Registration Successful!");

    form.reset();
});