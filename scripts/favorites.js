const baseAPI = "https://employmentdecoderapi.onrender.com/";
//const baseAPI = "http://localhost:3000/";

const apiUrl = baseAPI + "job";

const jobsListContainer = document.getElementById("jobs-list-container");
const signinLink = document.getElementById("signin-link");
const signupLink = document.getElementById("signup-link");

const email = localStorage.getItem("candidate");
const token = localStorage.getItem("token");
const id = localStorage.getItem("candidateId");

const DateTime = luxon.DateTime;

async function fetchJobs() {
    let jobs = null;

    try {
        const fetchedJobs = await fetch(`${baseAPI}candidate/favorites/${email}`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
            },
        });
        jobs = await fetchedJobs.json();
    } catch (error) {
        alert(error);
    }

    jobs.forEach((job) => {
        const cardDiv = Object.assign(document.createElement("div"), {
            classList: "card",
            style: "width: 50rem",
            id: job._id,
        });

        cardDiv.dataset.jobID = job.id;

        // trimmed description p element
        const cardText = document.createElement("p");
        cardText.classList.add("card-text");
        const favLink = document.createElement("a");
        favLink.id = `fav-jobId-${job._id}`;
        const favImg = document.createElement("img");
        favImg.src = "../star.png";
        favImg.classList.add("fav-img");
        favImg.style = "width: 20px; height: 20px";
        favLink.append(favImg);

        const slicedJobDescription = job.contents.slice(0, 200);
        cardText.innerHTML = `
         
      <p><b>Salary: </b>${job.pay}</p>
      <p><b>Location:</b> ${job.location}</p>
      <p><b>Job Description: </b>${slicedJobDescription}</p>
      `;

        cardDiv.innerHTML = `
      <div class="card-body">
      <h5 class="card-title">${job.name}</h5>
    </div>
      `;
        cardDiv.querySelector(".card-body").appendChild(cardText);
        cardDiv.querySelector(".card-body").appendChild(favLink);

        jobsListContainer.appendChild(cardDiv);
    });

    //pagination handling
    const itemsPerPage = 5;

    let currentPage = 1;

    // Calculate the number of total pages based on the number of jobs
    const totalPages = Math.ceil(jobs.length / itemsPerPage);

    // Create the pagination links dynamically
    for (let i = 1; i <= totalPages; i++) {
        const pageLink = document.createElement("li");
        pageLink.classList.add("page-item");
        pageLink.innerHTML = `<a class="page-link" href="#">${i}</a>`;
        document.querySelector(".pagination").appendChild(pageLink);

        if (i === 1) {
            pageLink.classList.add("active");
        }
    }

    // jobs on current page
    async function showPage(page) {
        const jobCards = $(".card");

        const start = (page - 1) * itemsPerPage;
        const end = start + itemsPerPage;

        jobCards.hide();
        jobCards.slice(start, end).show();
        // calling function to display first job

        await displayFirstJobDetails(jobCards.slice(start, end)[0].id);
        // add "active" class for highlight color"
    }

    showPage(currentPage);

    // Handle pagination click events
    $(".pagination").on("click", "a.page-link", function (e) {
        e.preventDefault();
        const text = $(this).text();
        if (text === "Previous") {
            if (currentPage > 1) {
                currentPage--;
                showPage(currentPage);
            }
        } else if (text === "Next") {
            if (currentPage < Math.ceil($(".card").length / itemsPerPage)) {
                currentPage++;
                showPage(currentPage);
            }
        } else {
            currentPage = parseInt(text);
            showPage(currentPage);
        }

        // check for active number, remove active class and add for current page number
        const pageItems = document.querySelectorAll(".pagination .page-item");

        pageItems.forEach((pageItem) => {
            pageItem.classList.remove("active");
        });

        const secondPageItem = document.querySelector(`.pagination .page-item:nth-child(${currentPage})`);

        secondPageItem.classList.add("active");
    });
}

// display first job on page in details on right
async function displayFirstJobDetails(id) {
    const fetchedJobs = await fetch(apiUrl);
    const jobs = await fetchedJobs.json();

    // const jobs = data.results;

    const job = jobs.find((job) => {
        return job._id.trim() === id.trim(); // white space though length same
    });

    const jobViewContainer = document.getElementById("jobs-view-conainer");

    const singleJobView = Object.assign(document.createElement("div"), {
        classList: "card",
        style: "width: 50rem",
        id: job._id,
    });

    singleJobView.innerHTML = `
    <h5>${job.name}</h5>
    <p>${job.location}</p>
    <p>${job.pay}</p>
    <p>Created: ${DateTime.fromISO(job.created_at).toLocaleString(DateTime.DATETIME_MED)}</p>
    <p>Updated: ${DateTime.fromISO(job.updatedAt).toLocaleString(DateTime.DATETIME_MED)}</p>
    <hr />
    <p>${job.contents}</p>
       <button type="button" class="btn btn-primary applyBtn" >Apply</button> 
    
       `;
    jobViewContainer.innerHTML = "";
    jobViewContainer.appendChild(singleJobView);
}

jobsListContainer.addEventListener("click", async (e) => {
    e.preventDefault();

    if (e.target.tagName === "IMG") {
        console.log(e.target.parentNode.id.split("-")[2]);
        console.log(localStorage.getItem("candidate"));

        const jobId = e.target.parentNode.id.split("-")[2];
        const email = localStorage.getItem("candidate");
        const token = localStorage.getItem("token");

        if (email && jobId) {
            // ---------------------------------------------------remove favorites-----------------------------------------------------------
            fetch("http://localhost:3000/candidate/favorites/remove", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify({ email, jobId }),
            })
                .then((response) => {
                    if (response.ok) {
                        alert("Job removed from favorites list!");
                        location.reload();
                    } else {
                        alert("Error: Action can not be completed!");
                    }
                })
                .then((response) => {
                    if (response.ok) {
                        alert("Job removed from favorites list!");
                        location.reload();
                    } else {
                        alert("Error: Action can not be completed!");
                    }
                })
                .catch((error) => {
                    console.error("Error:", error);
                });
        } else {
            alert("Please sign in to favorite jobs!");
        }
    }

    const target = e.target.closest(".card");

    const fetchedJobs = await fetch(apiUrl);
    const jobs = await fetchedJobs.json();
    // const jobs = data.results;

    const job = jobs.find((job) => {
        return job._id.trim() === target.id.trim();
    });

    const jobViewContainer = document.getElementById("jobs-view-conainer");

    const singleJobView = Object.assign(document.createElement("div"), {
        classList: "card",
        style: "width: 50rem",
        id: job._id,
    });

    singleJobView.innerHTML = `
    <h5>${job.name}</h5>
    <p>${job.location}</p>
    <p>${job.pay}</p>
    <p>Created: ${DateTime.fromISO(job.created_at).toLocaleString(DateTime.DATETIME_MED)}</p>
    <p>Updated: ${DateTime.fromISO(job.updatedAt).toLocaleString(DateTime.DATETIME_MED)}</p>
    <hr />
    <p>${job.contents}</p>
        <button type="button" class="btn btn-primary applyBtn">Apply</button>
     
        `;
    jobViewContainer.innerHTML = "";
    jobViewContainer.appendChild(singleJobView);
});

fetchJobs();

if (email && token && id) {
    signinLink.innerText = email;
    signinLink.removeAttribute("href");

    signupLink.innerHTML = ``;
    signupLink.removeAttribute("href");

    const signOutElement = document.createElement("li");
    signOutElement.classList.add("nav-item");
    signOutElement.id = "favSignoutLink";
    signOutElement.innerHTML = `
<a class="nav-link active" aria-current="page" id="signup-link" onclick="signout()">Sign Out</a>
`;
    document.getElementById("nav-items-lst").append(signOutElement);
}
