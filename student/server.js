const express = require("express");
const session = require("express-session");
const bcrypt = require("bcryptjs");
const fs = require("fs");
const path = require("path");

const app = express();

const PORT = process.env.PORT || 3000;

const DATA_FILE = path.join(__dirname, "data", "students.json");

// ---------------------------
// Middleware
// ---------------------------

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use(express.static(path.join(__dirname, "public")));

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

app.use(
    session({
        secret: process.env.SESSION_SECRET || "student_portal_secret_key",
        resave: false,
        saveUninitialized: false,
        cookie: {
            maxAge: 60 * 60 * 1000
        }
    })
);


// ---------------------------
// Load students
// ---------------------------

function loadStudents() {

    try {

        if (!fs.existsSync(DATA_FILE)) {
            return [];
        }

        const data = fs.readFileSync(DATA_FILE, "utf8");

        if (!data.trim()) {
            return [];
        }

        return JSON.parse(data);

    } catch (error) {

        console.error("Error reading students.json:", error);

        return [];
    }
}


// ---------------------------
// Save students
// ---------------------------

function saveStudents(students) {

    try {

        const directory = path.dirname(DATA_FILE);

        if (!fs.existsSync(directory)) {
            fs.mkdirSync(directory, { recursive: true });
        }

        fs.writeFileSync(
            DATA_FILE,
            JSON.stringify(students, null, 4)
        );

    } catch (error) {

        console.error("Error saving students:", error);

    }
}


// ---------------------------
// Authentication middleware
// ---------------------------

function requireLogin(req, res, next) {

    if (!req.session.username) {

        return res.redirect(
            "/login?message=Please login first"
        );

    }

    next();
}


// ---------------------------
// Home
// ---------------------------

app.get("/", (req, res) => {

    if (req.session.username) {
        return res.redirect("/dashboard");
    }

    res.redirect("/login");

});


// ---------------------------
// Registration Page
// ---------------------------

app.get("/register", (req, res) => {

    res.render("register", {
        message: req.query.message || ""
    });

});


// ---------------------------
// Registration
// ---------------------------

app.post("/register", async (req, res) => {

    try {

        const {
            username,
            password,
            branch,
            year,
            semester,
            email
        } = req.body;


        if (
            !username ||
            !password ||
            !branch ||
            !year ||
            !semester ||
            !email
        ) {

            return res.redirect(
                "/register?message=All fields are required"
            );

        }


        const students = loadStudents();


        // Check username
        const usernameExists = students.some(
            student =>
                student.username.toLowerCase() ===
                username.toLowerCase()
        );


        if (usernameExists) {

            return res.redirect(
                "/register?message=Username already exists"
            );

        }


        // Check email
        const emailExists = students.some(
            student =>
                student.email.toLowerCase() ===
                email.toLowerCase()
        );


        if (emailExists) {

            return res.redirect(
                "/register?message=Email already registered"
            );

        }


        // Encrypt password
        const hashedPassword =
            await bcrypt.hash(password, 10);


        const newStudent = {

            username: username,

            password: hashedPassword,

            branch: branch,

            year: year,

            semester: semester,

            email: email

        };


        students.push(newStudent);

        saveStudents(students);


        res.redirect(
            "/login?message=Registration successful. Please login."
        );


    } catch (error) {

        console.error(error);

        res.status(500).send(
            "Server Error"
        );

    }

});


// ---------------------------
// Login Page
// ---------------------------

app.get("/login", (req, res) => {

    res.render("login", {
        message: req.query.message || ""
    });

});


// ---------------------------
// Login
// ---------------------------

app.post("/login", async (req, res) => {

    try {

        const {
            username,
            password
        } = req.body;


        const students = loadStudents();


        const student = students.find(
            student =>
                student.username.toLowerCase() ===
                username.toLowerCase()
        );


        if (!student) {

            return res.redirect(
                "/login?message=Invalid username or password"
            );

        }


        const passwordMatch =
            await bcrypt.compare(
                password,
                student.password
            );


        if (!passwordMatch) {

            return res.redirect(
                "/login?message=Invalid username or password"
            );

        }


        req.session.username =
            student.username;


        res.redirect("/dashboard");


    } catch (error) {

        console.error(error);

        res.status(500).send(
            "Server Error"
        );

    }

});


// ---------------------------
// Dashboard
// ---------------------------

app.get(
    "/dashboard",
    requireLogin,
    (req, res) => {

        res.render("dashboard", {

            username:
                req.session.username

        });

    }
);


// ---------------------------
// Logout
// ---------------------------

app.get("/logout", (req, res) => {

    req.session.destroy(error => {

        if (error) {

            console.error(error);

            return res.redirect(
                "/dashboard"
            );

        }

        res.redirect(
            "/login?message=Logged out successfully"
        );

    });

});


// ---------------------------
// Start Server
// ---------------------------

app.listen(PORT, () => {

    console.log(
        `Student Portal running on port ${PORT}`
    );

});
