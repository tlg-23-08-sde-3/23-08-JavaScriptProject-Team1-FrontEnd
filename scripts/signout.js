document.addEventListener("DOMContentLoaded", function () {
    const signoutLink = document.getElementById("signout-link");

    if (signoutLink) {
        signoutLink.addEventListener("click", function (e) {
            e.preventDefault();
            signout();
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
        if (localStorage.getItem("token") && localStorage.getItem("companyEmail")) {
            localStorage.removeItem("token");
            localStorage.removeItem("companyEmail");
            localStorage.removeItem("companyId");

            window.location.reload();
        }
    } catch (error) {
        alert(error);
    }
}
