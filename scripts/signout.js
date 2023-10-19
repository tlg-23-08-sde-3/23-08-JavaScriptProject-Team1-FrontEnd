// External JavaScript file (signout.js)

document.addEventListener("DOMContentLoaded", function () {
   const signoutLink = document.getElementById("signout-link");

   if (signoutLink) {
      signoutLink.addEventListener("click", function (e) {
         e.preventDefault(); // Prevent the default link behavior (e.g., navigating to a new page)
         signout(); // Call your signout function
      });
   }
});

function signout() {
   try {
      if (localStorage.getItem("token") && localStorage.getItem("candidate")) {
         localStorage.removeItem("token");
         localStorage.removeItem("candidate");

         window.location.reload();
      }
   } catch (error) {
      alert(error);
   }
}
