from flask import Flask, render_template, request, redirect, url_for, session, flash
from werkzeug.security import generate_password_hash, check_password_hash
import json
import os

app = Flask(__name__)
app.secret_key = "student_portal_secret_key"

DATA_FILE = "data/students.json"


def load_students():
    if not os.path.exists(DATA_FILE):
        return []

    try:
        with open(DATA_FILE, "r") as file:
            return json.load(file)
    except (json.JSONDecodeError, FileNotFoundError):
        return []


def save_students(students):
    os.makedirs("data", exist_ok=True)

    with open(DATA_FILE, "w") as file:
        json.dump(students, file, indent=4)


@app.route("/")
def home():
    if "username" in session:
        return redirect(url_for("dashboard"))

    return redirect(url_for("login"))


@app.route("/register", methods=["GET", "POST"])
def register():

    if request.method == "POST":

        username = request.form["username"].strip()
        password = request.form["password"]
        branch = request.form["branch"]
        year = request.form["year"]
        semester = request.form["semester"]
        email = request.form["email"].strip()

        students = load_students()

        # Check duplicate username
        for student in students:
            if student["username"].lower() == username.lower():
                flash("Username already exists!", "danger")
                return redirect(url_for("register"))

        # Check duplicate email
        for student in students:
            if student["email"].lower() == email.lower():
                flash("Email ID already registered!", "danger")
                return redirect(url_for("register"))

        new_student = {
            "username": username,
            "password": generate_password_hash(password),
            "branch": branch,
            "year": year,
            "semester": semester,
            "email": email
        }

        students.append(new_student)

        save_students(students)

        flash("Registration successful! Please login.", "success")

        return redirect(url_for("login"))

    return render_template("register.html")


@app.route("/login", methods=["GET", "POST"])
def login():

    if request.method == "POST":

        username = request.form["username"].strip()
        password = request.form["password"]

        students = load_students()

        for student in students:

            if student["username"].lower() == username.lower():

                if check_password_hash(student["password"], password):

                    session["username"] = student["username"]

                    return redirect(url_for("dashboard"))

        flash("Invalid username or password!", "danger")

    return render_template("login.html")


@app.route("/dashboard")
def dashboard():

    if "username" not in session:
        flash("Please login first.", "warning")
        return redirect(url_for("login"))

    return render_template(
        "dashboard.html",
        username=session["username"]
    )


@app.route("/logout")
def logout():

    session.clear()

    flash("You have been logged out.", "success")

    return redirect(url_for("login"))


if __name__ == "__main__":
    app.run(debug=True)
