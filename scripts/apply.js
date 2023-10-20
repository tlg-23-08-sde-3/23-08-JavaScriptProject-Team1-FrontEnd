const baseAPI = "https://employmentdecoderapi.onrender.com/";
//const baseAPI = "http://localhost:3000/";

const jobViewContainer = document.getElementById("jobs-view-conainer");

const candidateId = localStorage.getItem("candidateId");
const email = localStorage.getItem("candidate");
const token = localStorage.getItem("token");

async function apply(jobId) {
    const fetchedJobs = await fetch(baseAPI + "job/id/" + jobId + "/candidate/" + candidateId, {
        method: "PUT",
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
        },
    })
        .then((response) => {
            if (response.ok) {
                alert(`Successfully applied for job ID: ${jobId}`);
                return response;
            } else {
                alert("Job Creation Failed Failed, please try again!");
                throw new Error("Job Creation Failed");
            }
        })
        .catch((error) => {
            console.error(error);
        });
}

jobViewContainer.addEventListener("click", async (e) => {
    e.preventDefault();
    if (e.target.classList.contains("applyBtn")) {
        if (candidateId && email && token) {
            const jobId = e.target.parentElement.id;
            apply(jobId);
        } else {
            location.assign("./pages/signin.html");
        }
    }
});
