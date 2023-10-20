const baseAPI = "https://employmentdecoderapi.onrender.com/";
//const baseAPI = "http://localhost:3000/";

const companyViewContainer = document.getElementById("company-view-container");
const jobsListContainer = document.getElementById("jobs-list-container");
const jobViewContainer = document.getElementById("job-detail-container");
const companyDisplay = document.getElementById("companyDisplay");
const companySignin = document.getElementById("compSigninLink");
const companySignup = document.getElementById("compSignupLink");

const companyId = localStorage.getItem("companyId");
const companyEmail = localStorage.getItem("companyEmail");
const token = localStorage.getItem("token");

if (!token || !companyId || !companyEmail) {
    location.assign("./signinCompany.html");
} else {
    async function fetchCompany() {
        const fullCompanyURL = baseAPI + "company/email/" + companyEmail;
        const fetchedCompany = await fetch(fullCompanyURL);
        const company = await fetchedCompany.json();

        companyDisplay.append(Object.assign(document.createElement("h4"), { textContent: company.name }));
        companyDisplay.append(Object.assign(document.createElement("h5"), { textContent: company.email }));
        companyDisplay.append(Object.assign(document.createElement("hr")));
        companyDisplay.append(Object.assign(document.createElement("h6"), { textContent: "Locations" }));
        companyDisplay.append(Object.assign(document.createElement("p"), { textContent: company.locations }));
        companyDisplay.append(Object.assign(document.createElement("hr")));
        companyDisplay.append(Object.assign(document.createElement("h6"), { textContent: "Industries" }));
        companyDisplay.append(Object.assign(document.createElement("p"), { textContent: company.industries }));
        companyDisplay.append(Object.assign(document.createElement("hr")));
    }

    async function fetchJobs() {
        const fetchedJobs = await fetch(baseAPI + "job/company/" + companyId, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
            },
        });
        const jobs = await fetchedJobs.json();

        jobs.forEach((job) => {
            const cardDiv = Object.assign(document.createElement("div"), {
                classList: "card",
                style: "width: 50rem",
                _id: job._id,
            });

            cardDiv.dataset.jobID = job._id;

            // trimmed description p element
            const cardText = document.createElement("p");
            cardText.classList.add("card-text");

            const slicedJobDescription = job.contents.slice(0, 200);
            cardText.innerHTML = slicedJobDescription;

            cardText.innerHTML = `
        <p>Pay: ${job.pay}</p>
        <p>Location: ${job.location}</p>
        <h6>Description</h6>
         <p>${slicedJobDescription}</p>
      `;

            cardDiv.innerHTML = `
      <div class="card-body">
      <h5 class="card-title">${job.name}</h5>
    </div>
      `;
            cardDiv.querySelector(".card-body").appendChild(cardText);

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
            await displayFirstJobDetails(jobCards[0].id);
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

            const secondPageItem = document.querySelector(`.pagination .page-item:nth-child(${currentPage + 1})`);

            secondPageItem.classList.add("active");
        });
    }

    // display first job on page in details on right
    async function displayFirstJobDetails(id) {
        const fetchedJobs = await fetch(baseAPI + "job/company/" + companyId);
        const data = await fetchedJobs.json();
        const jobs = data;

        const job = jobs[0];

        const singleJobView = Object.assign(document.createElement("div"), {
            classList: "card",
            style: "width: 50rem",
        });

        singleJobView.innerHTML = `
   <h5>${job.name}</h5>
   <p>Pay: ${job.pay}</p>
   <p>Location: ${job.location}</p>
   <h6>Description</h6>
   <p>${job.contents}</p>
   <hr>
   <p>Applicants</p>
   <p>${job.applicants}</p>
   `;
        jobViewContainer.innerHTML = "";
        jobViewContainer.appendChild(singleJobView);
    }

    jobsListContainer.addEventListener("click", async (e) => {
        e.preventDefault();

        const target = e.target.closest(".card");

        const fetchedJobs = await fetch(baseAPI + "job");
        const data = await fetchedJobs.json();
        const jobs = data;

        const job = jobs.find((job) => {
            return job._id === target._id;
        });

        const singleJobView = Object.assign(document.createElement("div"), {
            classList: "card",
            style: "width: 50rem",
        });

        singleJobView.innerHTML = `
    <h5>Title: ${job.name}</h5>
    <h6>Description</h6>
    <p>${job.contents}</p>
    <p>Location: ${job.location}</p>
    <hr>
   <p>Applicants</p>
   <p>${job.applicants}</p>

   `;
        jobViewContainer.innerHTML = "";
        jobViewContainer.appendChild(singleJobView);
    });

    fetchCompany();
    fetchJobs();

    if (companyEmail && companyId) {
        companySignin.innerText = companyEmail;
        companySignin.removeAttribute("href");

        companySignup.innerHTML = ``;
        companySignup.removeAttribute("href");

        const signOutElement = document.createElement("li");
        signOutElement.classList.add("nav-item");
        signOutElement.id = "compSignoutLink";
        signOutElement.innerHTML = `
    <a class="nav-link active" aria-current="page" onclick="signout()">Sign Out</a>
    `;
        document.getElementById("companyNavBar").append(signOutElement);
    }
}
