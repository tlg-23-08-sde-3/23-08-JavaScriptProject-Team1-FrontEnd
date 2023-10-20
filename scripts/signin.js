const baseAPI = "https://employmentdecoderapi.onrender.com/";
//const baseAPI = "http://localhost:3000/";

document.getElementById("signInForm").addEventListener("submit", (event) => {
    event.preventDefault();

    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;

    localStorage.removeItem("token");
    localStorage.removeItem("candidate");
    localStorage.removeItem("candidateId");
    localStorage.removeItem("companyEmail");
    localStorage.removeItem("companyId");

    fetch(baseAPI + "candidate/signin", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
    })
        .then((response) => {
            if (response.ok) {
                return response.json();
            } else {
                alert("Sign In Failed, please try again!");
                throw new Error("Sign In Failed");
            }
        })
        .then((data) => {
            localStorage.setItem("token", data.token);
            localStorage.setItem("candidate", data.email);
            localStorage.setItem("candidateId", data._id);

            window.location.href = "../index.html";
            // document.getElementById("keywords-search-input").innerText =
            //    "Logged In";
        })
        .catch((error) => {
            console.error(error);
        });
});
