const baseAPI = "https://employmentdecoderapi.onrender.com/";
//const baseAPI = "http://localhost:3000/";

document.getElementById("companySignUpForm").addEventListener("submit", (event) => {
    event.preventDefault(); // Prevent the default form submission

    const inputFields = companySignUpForm.querySelectorAll("input");

    const companyData = {};

    inputFields.forEach(function (input) {
        const fieldName = input.id;
        const fieldValue = input.value;

        if (fieldName && fieldValue) {
            companyData[fieldName] = fieldValue;
        }
    });

    if (companyData.password !== companyData.passwordConfirm) {
        alert("Sign Up Failed, passwords do not match!");
        throw new Error("Sign Up Failed");
    }

    companySignUpForm.reset();

    fetch(baseAPI + "company/signup", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(companyData),
    })
        .then((response) => {
            if (response.ok) {
                location.assign("../pages/company.html");
                return response.json();
            } else {
                alert("Sign Up Failed, please try again!");
                throw new Error("Sign Up Failed");
            }
        })
        .then((data) => {
            localStorage.setItem("token", data.token);
            localStorage.setItem("companyId", data._id);
            localStorage.setItem("companyEmail", data.email);
        })
        .catch((error) => {
            console.error(error);
        });

    //   TODO: Add a banner for successfuly sign up and change signup to firstname + lastnam
});
