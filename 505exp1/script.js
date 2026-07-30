const form = document.getElementById("registrationForm");

form.addEventListener("submit", function(event){

    event.preventDefault();

    let name = document.getElementById("name").value.trim();
    let father = document.getElementById("father").value.trim();
    let dob = document.getElementById("dob").value;
    let email = document.getElementById("email").value.trim();
    let phone = document.getElementById("phone").value.trim();
    let college = document.getElementById("college").value.trim();

    // Required field validation
    if(name === ""){
        alert("Student Name is required.");
        return;
    }

    if(dob === ""){
        alert("Date of Birth is required.");
        return;
    }

    if(phone === ""){
        alert("Phone Number is required.");
        return;
    }

    if(college === ""){
        alert("College Name is required.");
        return;
    }

    // Phone number validation
    let phonePattern = /^[0-9]{10}$/;

    if(!phonePattern.test(phone)){
        alert("Phone Number must contain exactly 10 digits.");
        return;
    }

    // Email validation (only if entered)
    if(email !== ""){
        let emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

        if(!emailPattern.test(email)){
            alert("Please enter a valid email address.");
            return;
        }
    }

    // Success
    alert("🎉 Registration Successful!\n\nWelcome to Student Fest, " + name + "!");

    // Reset form
    form.reset();

}};