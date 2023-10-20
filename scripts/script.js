const baseAPI = "https://employmentdecoderapi.onrender.com/";
//const baseAPI = "http://localhost:3000/";

import { favEventHandler } from "./FavoriteEventListener.js";
import { authLinkCheck } from "./authLinkCheck.js";
import { jobSearch } from "./jobSearch.js";

const DateTime = luxon.DateTime;

const apiUrl = baseAPI + "job";

const jobsListContainer = document.getElementById("jobs-list-container");
const email = localStorage.getItem("candidate");
const token = localStorage.getItem("token");

fetchJobs();

async function fetchJobs() {
    const fetchedJobs = await fetch(apiUrl);
    const jobs = await fetchedJobs.json();
    console.log(jobs);

    jobs.forEach((job) => {
        const cardDiv = Object.assign(document.createElement("div"), {
            classList: "card",
            style: "width: 50rem",
            id: job._id,
        });

        cardDiv.dataset.jobID = job.id;

        // create cards for jibs
        createJobCards(job, jobsListContainer, cardDiv);
    });

    //------------------------------------------------pagination handling-------------------------------------------------
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

        // default highlight on page 1
        if (i === 1) {
            pageLink.classList.add("active");
        }
    }

    showPage(currentPage);

    // jobs on current page
    async function showPage(page) {
        const jobCards = $(".card");

        const start = (page - 1) * itemsPerPage;
        const end = start + itemsPerPage;

        jobCards.hide();
        jobCards.slice(start, end).show();

        // calling function to display first job
        await displayFirstJobDetails(jobCards.slice(start, end)[0].id);
    }

    // -----------------------------------------------Handle pagination click events---------------------------------------------------
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

        // pagination style: check for active number, remove active class and add for current page number
        const pageItems = document.querySelectorAll(".pagination .page-item");

        pageItems.forEach((pageItem) => {
            pageItem.classList.remove("active");
        });

        const secondPageItem = document.querySelector(`.pagination .page-item:nth-child(${currentPage})`);

        secondPageItem.classList.add("active");
    });
}

// create cards for jobs function

function createJobCards(job, jobsListContainer, cardDiv) {
    const cardText = document.createElement("p");
    cardText.classList.add("card-text");
    const favLink = document.createElement("a");
    favLink.id = `fav-jobId-${job._id}`;

    const favImg = document.createElement("img");
    favImg.classList.add("fav-img");
    favImg.src = "star.png";
    favImg.style = "width: 20px; height: 20px";
    favLink.append(favImg);

    const slicedJobDescription = job.contents.slice(0, 200);
    cardText.innerHTML = `
         
         <p><b>Salary: </b>${job.pay}</p>
         <p><b>Location: </b>${job.location}</p>
         <p><b>Job ID:</b> ${job._id}</p>
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
}

// --------------------------------------------------display first job on page in details on right-----------------------------------------
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
    const createdLocalDate = DateTime.fromISO(job.created_at).toLocaleString(DateTime.DATETIME_MED);
    console.log(createdLocalDate);
    singleJobView.innerHTML = `
   <h5>${job.name}</h5>
   <p>${job.location}</p>
   <p>Job ID: ${job._id}</p>
   <p>Salary: ${job.pay}</p>
   <p>Created: ${DateTime.fromISO(job.created_at).toLocaleString(DateTime.DATETIME_MED)}</p>
   <p>Updated: ${DateTime.fromISO(job.updatedAt).toLocaleString(DateTime.DATETIME_MED)}</p>
   <hr />
   <p>${job.contents}</p>
   <button class="btn btn-primary applyBtn" >Apply</button> 
   `;
    jobViewContainer.innerHTML = "";
    jobViewContainer.appendChild(singleJobView);
}

// ---------------------------------------------------Event Listener For Job Click-------------------------------------------------------------------
jobsListContainer.addEventListener("click", async (e) => {
    e.preventDefault();

    // ---------------------------------------------------favorite add--------------------------------------------------------------------------------
    if (e.target.tagName === "IMG") {
        const jobId = e.target.parentNode.id.split("-")[2]; // extracting job id
        //   const email = localStorage.getItem("candidate");
        //   const token = localStorage.getItem("token");

        if (email && jobId) {
            fetch(baseAPI + "candidate/favorites/add", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify({ email, jobId }),
            })
                .then((response) => {
                    if (response.ok) {
                        alert("Added to favorites list!");
                    } else {
                        alert("Already Favorited!");
                    }
                })
                .catch((error) => {
                    console.error("Error:", error);
                });
        } else {
            alert("Please sign in to favorite jobs!");
        }
    }

    //---------------------------------------------------------------Select Job Card-------------------------------------------------------

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
    <p>Job ID: ${job._id}</p>
    <p>Salary: ${job.pay}</p>
    <p>Created: ${DateTime.fromISO(job.created_at).toLocaleString(DateTime.DATETIME_MED)}</p>
    <p>Updated: ${DateTime.fromISO(job.updatedAt).toLocaleString(DateTime.DATETIME_MED)}</p>
    <hr />
    <p>${job.contents}</p>
   <button class="btn btn-primary applyBtn">Apply</button>

   `;
    jobViewContainer.innerHTML = "";
    jobViewContainer.appendChild(singleJobView);
});

// --------------------------------------------------------search jobs Event Listener-------------------------------------------------------------

document.getElementById("search-jobs-form").addEventListener("submit", async (e) => {
    e.preventDefault();
    console.log("searching");

    jobSearch();
});

// modify sign/sign up links

authLinkCheck();

//favorite link event handler
favEventHandler();
