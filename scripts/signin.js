document.getElementById("signInForm").addEventListener("submit", (event) => {
   event.preventDefault(); // Prevent the default form submission

   const email = document.getElementById("email").value;
   const password = document.getElementById("password").value;

   fetch("http://localhost:3000/candidate/signin", {
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
            alert("Sign Up Failed, please try again!");
            throw new Error("Sign Up Failed");
         }
      })
      .then((data) => {
         localStorage.setItem("token", data.token);

         window.location.href = "../index.html";
      })
      .catch((error) => {
         console.error(error);
      });
   //   TODO: Add a banner for successfuly sign up and change signup to firstname + lastname
});
