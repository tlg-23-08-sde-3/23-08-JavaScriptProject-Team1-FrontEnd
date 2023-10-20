const baseAPI = "https://employmentdecoderapi.onrender.com/";
//const baseAPI = "http://localhost:3000/";

export const favEventHandler = () => {
    document.getElementById("favorites-link").addEventListener("click", async (e) => {
        e.preventDefault();
        const email = localStorage.getItem("candidate");
        const token = localStorage.getItem("token");

        try {
            const temp = await fetch(
                `${baseAPI}candidate/favorites/${email}`, // middleware check for token
                {
                    method: "GET",
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${token}`,
                    },
                }
            );

            const res = await temp.json();
            if (res.message === "No Token Provided" || res.message === "Invalid Token") {
                location.assign("./pages/signin.html");
                return;
            }
            window.location.href = "./pages/favorites.html"; // this page will run script to load favorite jobs and render to HTML
        } catch (error) {
            console.log("error here");
            alert(error);
        }
    });
};
