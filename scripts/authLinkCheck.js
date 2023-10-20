export const authLinkCheck = () => {
    if (localStorage.getItem("candidate")) {
        console.log(localStorage.getItem("candidate"));
        document.getElementById("signin-link").innerText = `Signed As: ${localStorage.getItem("candidate")}`;
        document.getElementById("signin-link").removeAttribute("href");

        document.getElementById("signup-lst").innerHTML = "";
        const signOutElement = document.createElement("li");
        signOutElement.classList.add("nav-item");
        signOutElement.id = "signout-lst";
        signOutElement.innerHTML = `
        <a class="nav-link active" aria-current="page" id="signup-link" onclick="signout()">Sign Out</a>
        `;
        document.getElementById("nav-items-lst").append(signOutElement);
    }
};
