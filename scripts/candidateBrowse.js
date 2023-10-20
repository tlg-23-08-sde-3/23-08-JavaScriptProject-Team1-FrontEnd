const baseAPI = "https://employmentdecoderapi.onrender.com/";
//const baseAPI = "http://localhost:3000/";

const companyViewContainer = document.getElementById("company-view-container");
const candidatesListContainer = document.getElementById("candidates-list-container");
const candidateViewContainer = document.getElementById("candidate-detail-container");
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

    async function fetchCandidates() {
        const fetchedCandidates = await fetch(baseAPI + "candidate", {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
            },
        });

        const candidates = await fetchedCandidates.json();
        console.log(candidates);
        candidates.forEach((candidate) => {
            const cardDiv = Object.assign(document.createElement("div"), {
                classList: "card",
                style: "width: 50rem",
                _id: candidate._id,
            });

            cardDiv.dataset.candidateID = candidate._id;

            const cardText = document.createElement("p");
            cardText.classList.add("card-text");

            cardText.innerHTML = `
        <p>${candidate.city}, ${candidate.state}</p>
        <hr />
        <h6>Skills</h6>
        <p>${candidate.skills}</p>
      `;

            cardDiv.innerHTML = `
      <div class="card-body">
      <h5 class="card-title">${candidate.firstName} ${candidate.lastName}</h5>
      <p>${candidate.email}</p>
      <hr />
    </div>
      `;
            cardDiv.querySelector(".card-body").appendChild(cardText);

            candidatesListContainer.appendChild(cardDiv);
        });

        //pagination handling
        const itemsPerPage = 5;

        let currentPage = 1;

        // Calculate the number of total pages based on the number of jobs
        const totalPages = Math.ceil(candidates.length / itemsPerPage);

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
            const candidateCards = $(".card");

            const start = (page - 1) * itemsPerPage;
            const end = start + itemsPerPage;

            candidateCards.hide();
            candidateCards.slice(start, end).show();
            // calling function to display first job
            await displayFirstJobDetails(candidateCards[0].id);
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
        const fetchedCandidates = await fetch(baseAPI + "candidate", {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
            },
        });
        const candidates = await fetchedCandidates.json();

        const candidate = candidates[0];

        const singleCandidateView = Object.assign(document.createElement("div"), {
            classList: "card",
            style: "width: 50rem",
        });

        singleCandidateView.innerHTML = `
    
   `;

        singleCandidateView.innerHTML = `
      <div class="card-body">
      <h5 class="card-title">${candidate.firstName} ${candidate.lastName}</h5>
      <p>${candidate.email}</p>
      <hr />
      <p>${candidate.city}, ${candidate.state}</p>
    <hr />
    <h6>Skills</h6>
    <p>${candidate.skills}</p>
    </div>
      `;
        candidateViewContainer.innerHTML = "";
        candidateViewContainer.appendChild(singleCandidateView);
    }

    candidatesListContainer.addEventListener("click", async (e) => {
        e.preventDefault();

        const target = e.target.closest(".card");

        const fetchedCandidates = await fetch(baseAPI + "candidate", {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
            },
        });
        const candidates = await fetchedCandidates.json();

        const candidate = candidates.find((candidate) => {
            return candidate._id === target._id;
        });

        const singleCandidateView = Object.assign(document.createElement("div"), {
            classList: "card",
            style: "width: 50rem",
        });

        singleCandidateView.innerHTML = `
    <div class="card-body">
      <h5 class="card-title">${candidate.firstName} ${candidate.lastName}</h5>
      <p>${candidate.email}</p>
      <hr />
      <p>${candidate.city}, ${candidate.state}</p>
    <hr />
    <h6>Skills</h6>
    <p>${candidate.skills}</p>
    </div>
   `;
        candidateViewContainer.innerHTML = "";
        candidateViewContainer.appendChild(singleCandidateView);
    });

    fetchCompany();
    fetchCandidates();

    if (companyEmail && companyId) {
        companySignin.innerText = companyEmail;

        companySignup.innerHTML = ``;

        const signOutElement = document.createElement("li");
        signOutElement.classList.add("nav-item");
        signOutElement.id = "compSignoutLink";
        signOutElement.innerHTML = `
    <a class="nav-link active" aria-current="page" id="signup-link" onclick="signout()">Sign Out</a>
    `;
        document.getElementById("companyNavBar").append(signOutElement);
    }
}
