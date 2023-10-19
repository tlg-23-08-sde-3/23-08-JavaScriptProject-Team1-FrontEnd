//const baseAPI = "https://employmentdecoderapi.onrender.com/";
const baseAPI = "http://localhost:3000/";

document.getElementById("signInCompanyForm").addEventListener("submit", (event) => {
    event.preventDefault(); // Prevent the default form submission

    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;

    fetch(baseAPI + "company/signin", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
    })
        .then((response) => {
            if (response.ok) {
                location.assign("../pages/company.html");
                return response.json();
            } else {
                alert("Sign In Failed, please try again!");
                throw new Error("Sign In Failed");
            }
        })
        .then((data) => {
            localStorage.setItem("token", data.token);
            localStorage.setItem("companyId", data._id);
            localStorage.setItem("companyEmail", data.email);

            // document.getElementById("keywords-search-input").innerText =
            //    "Logged In";
        })
        .catch((error) => {
            console.error(error);
        });
    //   TODO: Add a banner for successfuly sign up and change signup to firstname + lastname
});
