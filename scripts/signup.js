const baseAPI = "https://employmentdecoderapi.onrender.com/";
//const baseAPI = "http://localhost:3000/";

document.getElementById("signUpForm").addEventListener("submit", (event) => {
    event.preventDefault(); // Prevent the default form submission

    const inputFields = signUpForm.querySelectorAll("input");

    const candidateData = {};

    inputFields.forEach(function (input) {
        const fieldName = input.id;
        const fieldValue = input.value;

        if (fieldName && fieldValue) {
            candidateData[fieldName] = fieldName === "dob" ? new Date(fieldValue) : fieldValue;
        }
    });

    if (candidateData.password !== candidateData.passwordConfirm) {
        alert("Sign Up Failed, passwords do not match!");
        throw new Error("Sign Up Failed");
    }

    signUpForm.reset();

    fetch(baseAPI + "candidate/signup", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(candidateData),
    })
        .then((response) => {
            if (response.ok) {
                return response.json();
            } else {
                alert("Sign Up Failed, please try again!");
                throw new Error("Sign Up Failed");
            }
        })
        .then((data) => {
            localStorage.setItem("token", data.token);
            localStorage.setItem("candidate", data.email);
            localStorage.setItem("candidateId", data._id);
            alert("Signed Up Successfully!");

            window.location.href = "../index.html";
        })
        .catch((error) => {
            console.error(error);
        });
});
