document.getElementById("signUpForm").addEventListener("submit", (event) => {
   event.preventDefault(); // Prevent the default form submission

   const inputFields = signUpForm.querySelectorAll("input");

   const candidateData = {};

   inputFields.forEach(function (input) {
      const fieldName = input.id;
      const fieldValue = input.value;

      if (fieldName && fieldValue) {
         candidateData[fieldName] =
            fieldName === "dob" ? new Date(fieldValue) : fieldValue;
      }
   });

   signUpForm.reset();

   fetch("http://localhost:3000/candidate/signup", {
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

         window.location.href = "../index.html";
      })
      .catch((error) => {
         console.error(error);
      });

   //   TODO: Add a banner for successfuly sign up and change signup to firstname + lastname
});
